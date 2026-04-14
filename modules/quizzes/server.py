#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import random
import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import re

class QuizHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.questions_data = {}
        self.load_questions()
        super().__init__(*args, **kwargs)

    def load_questions(self):
        """Загружает все вопросы из файлов категорий"""
        categories_dir = "OpenTriviaQA-master/categories"
        
        if not os.path.exists(categories_dir):
            print(f"Директория {categories_dir} не найдена!")
            return
        
        for filename in os.listdir(categories_dir):
            if os.path.isfile(os.path.join(categories_dir, filename)):
                category = filename
                questions = self.parse_questions_file(os.path.join(categories_dir, filename))
                if questions:
                    self.questions_data[category] = questions
                    print(f"Загружено {len(questions)} вопросов из категории '{category}'")

    def parse_questions_file(self, filepath):
        """Парсит файл с вопросами и возвращает список вопросов"""
        questions = []
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
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

    def do_GET(self):
        """Обрабатывает GET запросы"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/categories':
            self.send_categories()
        elif path.startswith('/api/questions/'):
            category = path.split('/')[-1]
            self.send_questions(category)
        else:
            # Обслуживаем статические файлы
            super().do_GET()

    def send_categories(self):
        """Отправляет список доступных категорий"""
        categories = list(self.questions_data.keys())
        self.send_json_response(categories)

    def send_questions(self, category):
        """Отправляет вопросы для указанной категории"""
        if category in self.questions_data:
            questions = self.questions_data[category]
            # Перемешиваем вопросы и берем случайные
            random.shuffle(questions)
            self.send_json_response(questions)
        else:
            self.send_error_response(f"Категория '{category}' не найдена")

    def send_json_response(self, data):
        """Отправляет JSON ответ"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(json_data.encode('utf-8'))

    def send_error_response(self, message, status_code=404):
        """Отправляет ошибку"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_data = {"error": message}
        json_data = json.dumps(error_data, ensure_ascii=False)
        self.wfile.write(json_data.encode('utf-8'))

    def end_headers(self):
        """Добавляет CORS заголовки"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def find_free_port():
    """Находит свободный порт"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port

def run_server(port=None):
    """Запускает сервер"""
    if port is None:
        port = find_free_port()
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, QuizHandler)
    
    print(f"🚀 Сервер запущен на http://localhost:{port}")
    print("📚 Квизы доступны в браузере")
    print("🛑 Для остановки нажмите Ctrl+C")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
