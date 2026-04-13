#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
import random

def parse_questions_file(filepath, max_questions=500):
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

def load_extended_categories():
    """Загружает расширенные категории с большим количеством вопросов"""
    categories_dir = "OpenTriviaQA-master/categories"
    all_data = {}
    
    if not os.path.exists(categories_dir):
        print(f"Директория {categories_dir} не найдена!")
        return {}
    
    # Расширенный список категорий с большим количеством вопросов
    categories_extended = [
        ('general', 500),           # Увеличиваем количество
        ('science-technology', 400),
        ('history', 300),
        ('geography', 300),
        ('literature', 300),
        ('music', 500),
        ('movies', 500),
        ('sports', 400),
        ('animals', 300),
        ('entertainment', 200),
        ('television', 500),
        ('video-games', 200),
        ('celebrities', 500),
        ('people', 400),
        ('world', 500),
        ('brain-teasers', 150),
        ('for-kids', 200),
        ('hobbies', 300),
        ('humanities', 300),
        ('religion-faith', 200),
        ('newest', 400),
        ('rated', 300)
    ]
    
    for category, max_questions in categories_extended:
        filepath = os.path.join(categories_dir, category)
        
        if os.path.exists(filepath):
            print(f"🔄 Загружаем категорию: {category} (макс. {max_questions} вопросов)")
            
            questions = parse_questions_file(filepath, max_questions)
            
            if questions:
                all_data[category] = questions
                print(f"✅ Загружено {len(questions)} вопросов для категории '{category}'")
            else:
                print(f"❌ Не удалось загрузить вопросы для категории '{category}'")
        else:
            print(f"❌ Файл {filepath} не найден")
    
    return all_data

def generate_js_file(data):
    """Генерирует JavaScript файл с данными"""
    js_content = "// Расширенная база данных квизов из OpenTriviaQA (английский язык)\n"
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
    print("📚 Загружаем РАСШИРЕННУЮ базу вопросов из OpenTriviaQA датасета...")
    
    # Загружаем расширенные категории
    all_data = load_extended_categories()
    
    if not all_data:
        print("❌ Не удалось загрузить данные!")
        return
    
    print(f"\n✅ Загружено {len(all_data)} категорий:")
    total_questions = 0
    for category, questions in all_data.items():
        print(f"   - {category}: {len(questions)} вопросов")
        total_questions += len(questions)
    
    # Генерируем JavaScript файл
    js_content = generate_js_file(all_data)
    
    # Сохраняем в файл
    with open('quiz-data-extended.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n💾 Расширенная база данных сохранена в quiz-data-extended.js")
    print(f"📊 Всего категорий: {len(all_data)}")
    print(f"📝 Всего вопросов: {total_questions}")
    print(f"🎯 Среднее количество вопросов на категорию: {total_questions // len(all_data)}")

if __name__ == "__main__":
    main()
