#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import time
import re
from googletrans import Translator

def extract_quiz_data_from_js(filepath):
    """Извлекает данные из JavaScript файла"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Находим объект quizData
        start = content.find('const quizData = {')
        if start == -1:
            raise ValueError("Не найден объект quizData")
        
        # Находим конец объекта
        brace_count = 0
        start_pos = content.find('{', start)
        end_pos = start_pos
        
        for i, char in enumerate(content[start_pos:], start_pos):
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_pos = i
                    break
        
        # Извлекаем JSON
        js_object = content[start_pos:end_pos + 1]
        
        # Заменяем одинарные кавычки на двойные
        js_object = js_object.replace("'", '"')
        
        # Исправляем JavaScript синтаксис для JSON
        js_object = re.sub(r'(\w+):', r'"\1":', js_object)
        
        # Парсим как JSON
        data = json.loads(js_object)
        return data
        
    except Exception as e:
        print(f"Ошибка извлечения данных: {e}")
        return None

def translate_questions_batch(questions, translator, max_translate=20):
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
            time.sleep(0.5)
            
            # Переводим варианты ответов
            translated_options = []
            for option in question['options']:
                translated_option = translator.translate(option, dest='ru', src='en').text
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
                
        except Exception as e:
            print(f"Ошибка перевода вопроса {i + 1}: {e}")
            # Если перевод не удался, используем оригинальный вопрос
            translated_questions.append(question)
    
    return translated_questions

def main():
    print("🌍 Переводим популярные категории на русский язык...")
    
    # Читаем полную базу данных
    data = extract_quiz_data_from_js('quiz-data-full-english.js')
    
    if not data:
        print("❌ Не удалось загрузить данные!")
        return
    
    # Инициализируем переводчик
    translator = Translator()
    
    # Популярные категории для перевода
    popular_categories = [
        'general',
        'science-technology', 
        'history',
        'geography',
        'animals'
    ]
    
    translated_data = {}
    
    for category in popular_categories:
        if category in data:
            print(f"\n🔄 Переводим категорию: {category}")
            questions = data[category]
            
            # Переводим первые 15 вопросов
            translated_questions = translate_questions_batch(questions, translator, max_translate=15)
            translated_data[category] = translated_questions
            
            print(f"✅ Переведено {len(translated_questions)} вопросов для категории '{category}'")
    
    # Генерируем JavaScript файл
    js_content = "// Популярные категории квизов - переведены на русский язык\n"
    js_content += "const quizData = {\n"
    
    for category, questions in translated_data.items():
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
        if category != list(translated_data.keys())[-1]:
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
    
    # Сохраняем в файл
    with open('quiz-data-popular-russian.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n💾 Популярные категории на русском сохранены в quiz-data-popular-russian.js")
    print(f"📊 Переведено категорий: {len(translated_data)}")
    
    total_questions = sum(len(questions) for questions in translated_data.values())
    print(f"📝 Всего переведенных вопросов: {total_questions}")

if __name__ == "__main__":
    main()
