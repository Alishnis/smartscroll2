#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
import random

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

def load_all_categories():
    """Загружает все категории из датасета"""
    categories_dir = "OpenTriviaQA-master/categories"
    all_data = {}
    
    if not os.path.exists(categories_dir):
        print(f"Директория {categories_dir} не найдена!")
        return {}
    
    for filename in os.listdir(categories_dir):
        if os.path.isfile(os.path.join(categories_dir, filename)):
            category = filename
            questions = parse_questions_file(os.path.join(categories_dir, filename))
            if questions:
                all_data[category] = questions
                print(f"Загружено {len(questions)} вопросов из категории '{category}'")
    
    return all_data

def generate_js_file(data):
    """Генерирует JavaScript файл с данными"""
    js_content = "// Данные квизов - загружены из OpenTriviaQA датасета\n"
    js_content += "const quizData = {\n"
    
    for category, questions in data.items():
        js_content += f"    '{category}': [\n"
        
        # Берем первые 50 вопросов из каждой категории для демонстрации
        sample_questions = questions[:50]
        
        for i, question in enumerate(sample_questions):
            js_content += "        {\n"
            js_content += f"            question: {json.dumps(question['question'], ensure_ascii=False)},\n"
            js_content += f"            options: {json.dumps(question['options'], ensure_ascii=False)},\n"
            js_content += f"            correctAnswer: {question['correctAnswer']}\n"
            js_content += "        }"
            
            if i < len(sample_questions) - 1:
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
    print("🔄 Загружаем данные из OpenTriviaQA датасета...")
    
    # Загружаем все категории
    all_data = load_all_categories()
    
    if not all_data:
        print("❌ Не удалось загрузить данные!")
        return
    
    print(f"\n✅ Загружено {len(all_data)} категорий:")
    for category, questions in all_data.items():
        print(f"   - {category}: {len(questions)} вопросов")
    
    # Генерируем JavaScript файл
    js_content = generate_js_file(all_data)
    
    # Сохраняем в файл
    with open('quiz-data-full.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n💾 Данные сохранены в quiz-data-full.js")
    print(f"📊 Всего категорий: {len(all_data)}")
    
    total_questions = sum(len(questions) for questions in all_data.values())
    print(f"📝 Всего вопросов: {total_questions}")

if __name__ == "__main__":
    main()
