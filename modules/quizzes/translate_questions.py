#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
import random
import time
from googletrans import Translator

def parse_questions_file(filepath):
    """Парсит файл с вопросами и возвращает список вопросов"""
    questions = []
    
    try:
        # Пробуем разные кодировки
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        content = None
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    content = f.read()
                break
            except UnicodeDecodeError:
                continue
        
        if content is None:
            print(f"Не удалось прочитать файл {filepath} ни с одной кодировкой")
            return []
        
        # Разделяем на отдельные вопросы
        question_blocks = re.split(r'\n\s*\n', content.strip())
        
        for block in question_blocks:
            if not block.strip():
                continue
                
            lines = [line.strip() for line in block.split('\n') if line.strip()]
            
            if len(lines) < 4:  # Минимум: вопрос, правильный ответ, 2 варианта
                continue
            
            question = None
            correct_answer = None
            options = []
            
            for line in lines:
                if line.startswith('#Q'):
                    question = line[2:].strip()
                elif line.startswith('^'):
                    correct_answer = line[1:].strip()
                elif re.match(r'^[A-E]', line):
                    option = re.sub(r'^[A-E]\s*', '', line).strip()
                    options.append(option)
            
            if question and correct_answer and len(options) >= 2:
                # Добавляем правильный ответ в список вариантов, если его там нет
                if correct_answer not in options:
                    options.append(correct_answer)
                
                # Перемешиваем варианты ответов
                random.shuffle(options)
                
                # Находим индекс правильного ответа
                correct_index = options.index(correct_answer)
                
                questions.append({
                    'question': question,
                    'options': options,
                    'correctAnswer': correct_index
                })
    
    except Exception as e:
        print(f"Ошибка при парсинге файла {filepath}: {e}")
    
    return questions

def translate_text(translator, text, max_retries=3):
    """Переводит текст с повторными попытками"""
    for attempt in range(max_retries):
        try:
            result = translator.translate(text, dest='ru', src='en')
            return result.text
        except Exception as e:
            print(f"Ошибка перевода (попытка {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2)  # Ждем перед повторной попыткой
            else:
                print(f"Не удалось перевести: {text[:50]}...")
                return text  # Возвращаем оригинальный текст
    
    return text

def translate_questions(questions, translator, max_questions=20):
    """Переводит вопросы на русский язык"""
    translated_questions = []
    
    # Берем только первые max_questions вопросов для демонстрации
    sample_questions = questions[:max_questions]
    
    print(f"Переводим {len(sample_questions)} вопросов...")
    
    for i, question in enumerate(sample_questions):
        print(f"Переводим вопрос {i + 1}/{len(sample_questions)}")
        
        # Переводим вопрос
        translated_question = translate_text(translator, question['question'])
        time.sleep(0.5)  # Небольшая задержка между запросами
        
        # Переводим варианты ответов
        translated_options = []
        for option in question['options']:
            translated_option = translate_text(translator, option)
            translated_options.append(translated_option)
            time.sleep(0.3)  # Задержка между переводами вариантов
        
        translated_questions.append({
            'question': translated_question,
            'options': translated_options,
            'correctAnswer': question['correctAnswer']
        })
        
        # Дополнительная задержка каждые 5 вопросов
        if (i + 1) % 5 == 0:
            time.sleep(2)
    
    return translated_questions

def load_and_translate_categories():
    """Загружает и переводит все категории"""
    categories_dir = "OpenTriviaQA-master/categories"
    all_data = {}
    
    if not os.path.exists(categories_dir):
        print(f"Директория {categories_dir} не найдена!")
        return {}
    
    # Инициализируем переводчик
    translator = Translator()
    
    # Список категорий для перевода (берем самые популярные)
    categories_to_translate = [
        'general', 'science-technology', 'history', 'geography', 
        'literature', 'music', 'sports', 'animals'
    ]
    
    for filename in os.listdir(categories_dir):
        if os.path.isfile(os.path.join(categories_dir, filename)) and filename in categories_to_translate:
            category = filename
            print(f"\n🔄 Обрабатываем категорию: {category}")
            
            questions = parse_questions_file(os.path.join(categories_dir, filename))
            if questions:
                print(f"Найдено {len(questions)} вопросов")
                
                # Переводим вопросы
                translated_questions = translate_questions(questions, translator, max_questions=15)
                all_data[category] = translated_questions
                
                print(f"✅ Переведено {len(translated_questions)} вопросов для категории '{category}'")
            else:
                print(f"❌ Не удалось загрузить вопросы для категории '{category}'")
    
    return all_data

def generate_js_file(data):
    """Генерирует JavaScript файл с переведенными данными"""
    js_content = "// Данные квизов - переведены на русский язык из OpenTriviaQA датасета\n"
    js_content += "const quizData = {\n"
    
    for category, questions in data.items():
        js_content += f"    '{category}': [\n"
        
        for i, question in enumerate(questions):
            js_content += "        {\n"
            js_content += f"            question: {json.dumps(question['question'], ensure_ascii=False)},\n"
            js_content += f"            options: {json.dumps(question['options'], ensure_ascii=False)},\n"
            js_content += f"            correctAnswer: {question['correctAnswer']}\n"
            js_content += "        }"
            
            if i < len(questions) - 1:
                js_content += ","
            js_content += "\n"
        
        js_content += "    ]"
        if category != list(data.keys())[-1]:
            js_content += ","
        js_content += "\n"
    
    js_content += "};\n\n"
    
    # Добавляем функции
    js_content += """// Функция для получения случайных вопросов из категории
function getRandomQuestions(category, count = 10) {
    const questions = quizData[category];
    if (!questions) return [];
    
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
}

// Функция для получения списка категорий
function getCategories() {
    return Object.keys(quizData);
}

// Функция для получения количества вопросов в категории
function getCategoryQuestionCount(category) {
    return quizData[category] ? quizData[category].length : 0;
}"""
    
    return js_content

def main():
    print("🌍 Начинаем перевод вопросов на русский язык...")
    print("⚠️  Это может занять некоторое время из-за ограничений API Google Translate")
    
    # Загружаем и переводим категории
    all_data = load_and_translate_categories()
    
    if not all_data:
        print("❌ Не удалось загрузить и перевести данные!")
        return
    
    print(f"\n✅ Переведено {len(all_data)} категорий:")
    for category, questions in all_data.items():
        print(f"   - {category}: {len(questions)} вопросов")
    
    # Генерируем JavaScript файл
    js_content = generate_js_file(all_data)
    
    # Сохраняем в файл
    with open('quiz-data-russian.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n💾 Переведенные данные сохранены в quiz-data-russian.js")
    print(f"📊 Всего категорий: {len(all_data)}")
    
    total_questions = sum(len(questions) for questions in all_data.values())
    print(f"📝 Всего переведенных вопросов: {total_questions}")

if __name__ == "__main__":
    main()
