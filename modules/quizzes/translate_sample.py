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
                time.sleep(1)  # Ждем перед повторной попыткой
            else:
                print(f"Не удалось перевести: {text[:50]}...")
                return text  # Возвращаем оригинальный текст
    
    return text

def main():
    print("🌍 Переводим образец вопросов на русский язык...")
    
    # Инициализируем переводчик
    translator = Translator()
    
    # Загружаем несколько вопросов из категории general
    questions = parse_questions_file("OpenTriviaQA-master/categories/general")
    
    if not questions:
        print("❌ Не удалось загрузить вопросы!")
        return
    
    # Берем первые 5 вопросов для демонстрации
    sample_questions = questions[:5]
    translated_questions = []
    
    print(f"Переводим {len(sample_questions)} вопросов...")
    
    for i, question in enumerate(sample_questions):
        print(f"\nВопрос {i + 1}:")
        print(f"Оригинал: {question['question']}")
        
        # Переводим вопрос
        translated_question = translate_text(translator, question['question'])
        print(f"Перевод: {translated_question}")
        
        # Переводим варианты ответов
        translated_options = []
        for j, option in enumerate(question['options']):
            translated_option = translate_text(translator, option)
            translated_options.append(translated_option)
            print(f"  {chr(65+j)}. {option} → {translated_option}")
        
        translated_questions.append({
            'question': translated_question,
            'options': translated_options,
            'correctAnswer': question['correctAnswer']
        })
        
        time.sleep(1)  # Задержка между вопросами
    
    # Сохраняем результат
    result = {
        'general': translated_questions
    }
    
    js_content = "// Образец переведенных вопросов\n"
    js_content += "const quizData = {\n"
    js_content += "    'general': [\n"
    
    for i, question in enumerate(translated_questions):
        js_content += "        {\n"
        js_content += f"            question: {json.dumps(question['question'], ensure_ascii=False)},\n"
        js_content += f"            options: {json.dumps(question['options'], ensure_ascii=False)},\n"
        js_content += f"            correctAnswer: {question['correctAnswer']}\n"
        js_content += "        }"
        
        if i < len(translated_questions) - 1:
            js_content += ","
        js_content += "\n"
    
    js_content += "    ]\n"
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
    
    with open('quiz-data-sample-russian.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n✅ Переведено {len(translated_questions)} вопросов")
    print("💾 Результат сохранен в quiz-data-sample-russian.js")

if __name__ == "__main__":
    main()
