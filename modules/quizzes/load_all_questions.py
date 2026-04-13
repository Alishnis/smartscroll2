#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
import random
from googletrans import Translator

def parse_questions_file(filepath, max_questions=100):
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
                
                # Ограничиваем количество вопросов для производительности
                if len(questions) >= max_questions:
                    break
    
    except Exception as e:
        print(f"Ошибка при парсинге файла {filepath}: {e}")
    
    return questions

def translate_questions_batch(questions, translator, max_translate=50):
    """Переводит вопросы пакетами"""
    if not questions:
        return []
    
    # Берем только первые max_translate вопросов для перевода
    questions_to_translate = questions[:max_translate]
    translated_questions = []
    
    print(f"Переводим {len(questions_to_translate)} вопросов...")
    
    for i, question in enumerate(questions_to_translate):
        try:
            print(f"  Переводим вопрос {i + 1}/{len(questions_to_translate)}")
            
            # Переводим вопрос
            translated_question = translator.translate(question['question'], dest='ru', src='en').text
            time.sleep(0.3)
            
            # Переводим варианты ответов
            translated_options = []
            for option in question['options']:
                translated_option = translator.translate(option, dest='ru', src='en').text
                translated_options.append(translated_option)
                time.sleep(0.2)
            
            translated_questions.append({
                'question': translated_question,
                'options': translated_options,
                'correctAnswer': question['correctAnswer']
            })
            
            # Дополнительная задержка каждые 5 вопросов
            if (i + 1) % 5 == 0:
                time.sleep(1)
                
        except Exception as e:
            print(f"Ошибка перевода вопроса {i + 1}: {e}")
            # Если перевод не удался, используем оригинальный вопрос
            translated_questions.append(question)
    
    return translated_questions

def load_all_categories_with_translation():
    """Загружает все категории с переводом"""
    categories_dir = "OpenTriviaQA-master/categories"
    all_data = {}
    
    if not os.path.exists(categories_dir):
        print(f"Директория {categories_dir} не найдена!")
        return {}
    
    # Инициализируем переводчик
    translator = Translator()
    
    # Список всех категорий
    all_categories = [
        'general', 'science-technology', 'history', 'geography', 
        'literature', 'music', 'movies', 'sports', 'animals',
        'entertainment', 'television', 'video-games', 'celebrities',
        'people', 'world', 'brain-teasers', 'for-kids', 'hobbies',
        'humanities', 'religion-faith', 'newest', 'rated'
    ]
    
    for category in all_categories:
        filepath = os.path.join(categories_dir, category)
        
        if os.path.exists(filepath):
            print(f"\n🔄 Обрабатываем категорию: {category}")
            
            # Загружаем вопросы (больше вопросов для больших категорий)
            max_questions = 200 if category in ['general', 'music', 'television', 'movies', 'world'] else 100
            
            questions = parse_questions_file(filepath, max_questions)
            
            if questions:
                print(f"Найдено {len(questions)} вопросов")
                
                # Переводим вопросы
                translated_questions = translate_questions_batch(questions, translator, max_translate=30)
                all_data[category] = translated_questions
                
                print(f"✅ Переведено {len(translated_questions)} вопросов для категории '{category}'")
            else:
                print(f"❌ Не удалось загрузить вопросы для категории '{category}'")
        else:
            print(f"❌ Файл {filepath} не найден")
    
    return all_data

def generate_js_file(data):
    """Генерирует JavaScript файл с переведенными данными"""
    js_content = "// Полная база данных квизов - переведена на русский язык из OpenTriviaQA\n"
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
}

// Функция для получения статистики по всем категориям
function getCategoriesStats() {
    const stats = {};
    Object.keys(quizData).forEach(category => {
        stats[category] = {
            count: quizData[category].length,
            name: category
        };
    });
    return stats;
}"""
    
    return js_content

def main():
    print("🌍 Загружаем ВСЕ вопросы из OpenTriviaQA датасета...")
    print("⚠️  Это займет много времени из-за перевода через Google Translate")
    
    # Загружаем и переводим все категории
    all_data = load_all_categories_with_translation()
    
    if not all_data:
        print("❌ Не удалось загрузить данные!")
        return
    
    print(f"\n✅ Обработано {len(all_data)} категорий:")
    total_questions = 0
    for category, questions in all_data.items():
        print(f"   - {category}: {len(questions)} вопросов")
        total_questions += len(questions)
    
    # Генерируем JavaScript файл
    js_content = generate_js_file(all_data)
    
    # Сохраняем в файл
    with open('quiz-data-complete.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n💾 Полная база данных сохранена в quiz-data-complete.js")
    print(f"📊 Всего категорий: {len(all_data)}")
    print(f"📝 Всего переведенных вопросов: {total_questions}")
    print(f"🎯 Среднее количество вопросов на категорию: {total_questions // len(all_data)}")

if __name__ == "__main__":
    import time
    main()
