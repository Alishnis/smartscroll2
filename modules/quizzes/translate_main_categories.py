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
                time.sleep(1)
            else:
                print(f"Не удалось перевести: {text[:50]}...")
                return text
    
    return text

def translate_questions_batch(questions, translator, max_questions=10):
    """Переводит вопросы пакетами"""
    translated_questions = []
    
    sample_questions = questions[:max_questions]
    
    for i, question in enumerate(sample_questions):
        print(f"  Переводим вопрос {i + 1}/{len(sample_questions)}")
        
        # Переводим вопрос
        translated_question = translate_text(translator, question['question'])
        time.sleep(0.5)
        
        # Переводим варианты ответов
        translated_options = []
        for option in question['options']:
            translated_option = translate_text(translator, option)
            translated_options.append(translated_option)
            time.sleep(0.3)
        
        translated_questions.append({
            'question': translated_question,
            'options': translated_options,
            'correctAnswer': question['correctAnswer']
        })
        
        # Дополнительная задержка каждые 3 вопроса
        if (i + 1) % 3 == 0:
            time.sleep(2)
    
    return translated_questions

def main():
    print("🌍 Переводим основные категории на русский язык...")
    
    # Инициализируем переводчик
    translator = Translator()
    
    # Основные категории для перевода
    categories = [
        'general',
        'science-technology', 
        'history',
        'geography',
        'literature',
        'music',
        'sports',
        'animals'
    ]
    
    all_data = {}
    
    for category in categories:
        print(f"\n🔄 Обрабатываем категорию: {category}")
        
        questions = parse_questions_file(f"OpenTriviaQA-master/categories/{category}")
        
        if questions:
            print(f"Найдено {len(questions)} вопросов")
            
            # Переводим первые 8 вопросов из каждой категории
            translated_questions = translate_questions_batch(questions, translator, max_questions=8)
            all_data[category] = translated_questions
            
            print(f"✅ Переведено {len(translated_questions)} вопросов")
        else:
            print(f"❌ Не удалось загрузить вопросы")
    
    # Генерируем JavaScript файл
    js_content = "// Данные квизов - переведены на русский язык\n"
    js_content += "const quizData = {\n"
    
    for category, questions in all_data.items():
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
        if category != list(all_data.keys())[-1]:
            js_content += ","
        js_content += "\n"
    
    js_content += "};\n\n"
    
    js_content += """// Функции
function getRandomQuestions(category, count = 10) {
    const questions = quizData[category];
    if (!questions) return [];
    
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
}

function getCategories() {
    return Object.keys(quizData);
}

function getCategoryQuestionCount(category) {
    return quizData[category] ? quizData[category].length : 0;
}"""
    
    # Сохраняем результат
    with open('quiz-data-russian.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n✅ Переведено {len(all_data)} категорий:")
    for category, questions in all_data.items():
        print(f"   - {category}: {len(questions)} вопросов")
    
    total_questions = sum(len(questions) for questions in all_data.values())
    print(f"\n💾 Переведенные данные сохранены в quiz-data-russian.js")
    print(f"📝 Всего переведенных вопросов: {total_questions}")

if __name__ == "__main__":
    main()
