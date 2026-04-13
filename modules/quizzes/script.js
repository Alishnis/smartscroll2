class QuizApp {
    constructor() {
        this.currentCategory = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.allCategories = [];
        this.filteredCategories = [];
        this.searchQuery = '';
        this.selectedFilter = null;
        this.suggestionIndex = -1;
        
        this.initializeElements();
        this.loadCategories();
        this.bindEvents();
    }

    initializeElements() {
        this.categorySelection = document.getElementById('category-selection');
        this.quizSection = document.getElementById('quiz-section');
        this.resultsSection = document.getElementById('results-section');
        this.reviewSection = document.getElementById('review-section');
        this.categoriesGrid = document.getElementById('categories-grid');
        this.quizTitle = document.getElementById('quiz-title');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.questionText = document.getElementById('question-text');
        this.answersContainer = document.getElementById('answers-container');
        this.nextQuestionBtn = document.getElementById('next-question');
        this.finishQuizBtn = document.getElementById('finish-quiz');
        this.scorePercentage = document.getElementById('score-percentage');
        this.correctAnswers = document.getElementById('correct-answers');
        this.totalAnswers = document.getElementById('total-answers');
        this.restartQuizBtn = document.getElementById('restart-quiz');
        this.chooseCategoryBtn = document.getElementById('choose-category');
        this.reviewErrorsBtn = document.getElementById('review-errors');
        
        // Элементы поиска
        this.searchInput = document.getElementById('search-input');
        this.searchSuggestions = document.getElementById('search-suggestions');
        this.filterTags = document.getElementById('filter-tags');
        
        // Элементы разбора ошибок
        this.backToResultsBtn = document.getElementById('back-to-results');
        this.totalQuestionsReview = document.getElementById('total-questions-review');
        this.correctAnswersReview = document.getElementById('correct-answers-review');
        this.incorrectAnswersReview = document.getElementById('incorrect-answers-review');
        this.allQuestionsList = document.getElementById('all-questions-list');
        this.incorrectQuestionsList = document.getElementById('incorrect-questions-list');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        
        // Элементы навигации по вопросам
        this.prevQuestionBtn = document.getElementById('prev-question');
        this.questionsGrid = document.getElementById('questions-grid');
        
        // Элемент выбора количества вопросов
        this.questionsCountSelect = document.getElementById('questions-count');
    }

    loadCategories() {
        try {
            const categories = getCategories();
            this.allCategories = categories;
            this.filteredCategories = [...categories];
            this.displayCategories(categories);
            this.displayFilterTags();
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
            this.displayError('Не удалось загрузить категории');
        }
    }

    displayCategories(categories) {
        this.categoriesGrid.innerHTML = '';
        
        if (categories.length === 0) {
            this.displayNoResults();
            return;
        }
        
        // Показываем информацию о результатах поиска
        if (this.searchQuery || this.selectedFilter) {
            this.displaySearchResultsInfo(categories.length);
        }
        
        categories.forEach(category => {
            const categoryCard = document.createElement('button');
            categoryCard.className = 'category-card';
            categoryCard.textContent = this.translateCategory(category);
            categoryCard.onclick = () => this.startQuiz(category);
            this.categoriesGrid.appendChild(categoryCard);
        });
    }

    displayFilterTags() {
        this.filterTags.innerHTML = '';
        
        const popularTags = [
            { key: 'general', label: 'Общие знания', icon: '🧠' },
            { key: 'science-technology', label: 'Наука', icon: '🔬' },
            { key: 'history', label: 'История', icon: '📜' },
            { key: 'geography', label: 'География', icon: '🌍' },
            { key: 'literature', label: 'Литература', icon: '📚' },
            { key: 'music', label: 'Музыка', icon: '🎵' },
            { key: 'movies', label: 'Кино', icon: '🎬' },
            { key: 'sports', label: 'Спорт', icon: '⚽' },
            { key: 'animals', label: 'Животные', icon: '🐾' },
            { key: 'television', label: 'ТВ', icon: '📺' },
            { key: 'video-games', label: 'Игры', icon: '🎮' },
            { key: 'celebrities', label: 'Звезды', icon: '⭐' },
            { key: 'world', label: 'Мир', icon: '🌎' },
            { key: 'brain-teasers', label: 'Головоломки', icon: '🧩' },
            { key: 'for-kids', label: 'Для детей', icon: '👶' }
        ];
        
        popularTags.forEach(tag => {
            if (this.allCategories.includes(tag.key)) {
                const tagElement = document.createElement('span');
                tagElement.className = 'filter-tag';
                tagElement.innerHTML = `${tag.icon} ${tag.label}`;
                tagElement.onclick = () => this.selectFilter(tag.key, tagElement);
                this.filterTags.appendChild(tagElement);
            }
        });
    }

    selectFilter(category, element) {
        // Убираем активный класс со всех тегов
        this.filterTags.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        
        // Добавляем активный класс к выбранному тегу
        element.classList.add('active');
        
        this.selectedFilter = category;
        this.searchInput.value = '';
        this.hideSuggestions();
        this.filterCategories();
    }

    clearFilter() {
        this.selectedFilter = null;
        this.searchInput.value = '';
        this.filterTags.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        this.hideSuggestions();
        this.filterCategories();
    }

    filterCategories() {
        let filtered = [...this.allCategories];
        
        // Применяем фильтр по категории
        if (this.selectedFilter) {
            filtered = filtered.filter(category => category === this.selectedFilter);
        }
        
        // Применяем поисковый запрос
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(category => {
                const translated = this.translateCategory(category).toLowerCase();
                return translated.includes(query) || category.toLowerCase().includes(query);
            });
        }
        
        this.filteredCategories = filtered;
        this.displayCategories(filtered);
    }

    displaySearchResultsInfo(count) {
        let infoText = '';
        if (this.searchQuery && this.selectedFilter) {
            infoText = `Найдено ${count} категорий по запросу "${this.searchQuery}" в разделе "${this.translateCategory(this.selectedFilter)}"`;
        } else if (this.searchQuery) {
            infoText = `Найдено ${count} категорий по запросу "${this.searchQuery}"`;
        } else if (this.selectedFilter) {
            infoText = `Показаны категории из раздела "${this.translateCategory(this.selectedFilter)}"`;
        }
        
        if (infoText) {
            const existingInfo = this.categoriesGrid.previousElementSibling;
            if (existingInfo && existingInfo.classList.contains('search-results-info')) {
                existingInfo.remove();
            }
            
            const infoElement = document.createElement('div');
            infoElement.className = 'search-results-info';
            infoElement.innerHTML = `
                ${infoText}
                <button class="clear-search" onclick="quizApp.clearFilter()">Очистить</button>
            `;
            this.categoriesGrid.parentNode.insertBefore(infoElement, this.categoriesGrid);
        }
    }

    displayNoResults() {
        this.categoriesGrid.innerHTML = `
            <div class="no-results">
                <h3>😔 Ничего не найдено</h3>
                <p>Попробуйте изменить поисковый запрос или выберите другую категорию</p>
                <button class="clear-search" onclick="quizApp.clearFilter()">Показать все категории</button>
            </div>
        `;
    }

    showSuggestions() {
        if (!this.searchQuery || this.searchQuery.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        const suggestions = this.allCategories
            .map(category => ({
                category,
                translated: this.translateCategory(category)
            }))
            .filter(item => 
                item.translated.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(this.searchQuery.toLowerCase())
            )
            .slice(0, 5);
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.searchSuggestions.innerHTML = '';
        suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.textContent = suggestion.translated;
            suggestionElement.onclick = () => this.selectSuggestion(suggestion.category);
            this.searchSuggestions.appendChild(suggestionElement);
        });
        
        this.searchSuggestions.classList.remove('hidden');
    }

    hideSuggestions() {
        this.searchSuggestions.classList.add('hidden');
        this.suggestionIndex = -1;
    }

    selectSuggestion(category) {
        this.searchInput.value = this.translateCategory(category);
        this.searchQuery = this.searchInput.value;
        this.hideSuggestions();
        this.clearFilter();
        this.filterCategories();
    }

    translateCategory(category) {
        const translations = {
            'general': 'Общие знания',
            'science-technology': 'Наука и технологии',
            'history': 'История',
            'geography': 'География',
            'literature': 'Литература',
            'music': 'Музыка',
            'movies': 'Кино',
            'sports': 'Спорт',
            'animals': 'Животные',
            'entertainment': 'Развлечения',
            'television': 'Телевидение',
            'video-games': 'Видеоигры',
            'celebrities': 'Знаменитости',
            'people': 'Люди',
            'world': 'Мир',
            'brain-teasers': 'Головоломки',
            'for-kids': 'Для детей',
            'hobbies': 'Хобби',
            'humanities': 'Гуманитарные науки',
            'religion-faith': 'Религия и вера',
            'newest': 'Новейшие',
            'rated': 'Рейтинговые'
        };
        
        return translations[category] || category;
    }

    startQuiz(category) {
        this.currentCategory = category;
        this.showLoading();
        
        try {
            const questionsCount = parseInt(this.questionsCountSelect.value);
            const questions = getRandomQuestions(category, questionsCount);
            
            if (questions.length === 0) {
                this.displayError('В этой категории нет вопросов');
                return;
            }
            
            this.questions = questions;
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.userAnswers = [];
            
            this.showQuiz();
            this.displayQuestion();
        } catch (error) {
            console.error('Ошибка загрузки вопросов:', error);
            this.displayError('Не удалось загрузить вопросы');
        }
    }

    showLoading() {
        this.categoriesGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Загрузка вопросов...</p>
            </div>
        `;
    }

    showQuiz() {
        this.categorySelection.classList.add('hidden');
        this.quizSection.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');
        this.reviewSection.classList.add('hidden');
        
        this.quizTitle.textContent = this.translateCategory(this.currentCategory);
        this.totalQuestionsSpan.textContent = this.questions.length;
        
        // Создаем навигацию по вопросам
        this.createQuestionNavigation();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.questionText.textContent = question.question;
        
        this.answersContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.textContent = option;
            answerElement.onclick = () => this.selectAnswer(index);
            
            // Если на этот вопрос уже был дан ответ, выделяем его
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                answerElement.classList.add('selected');
            }
            
            this.answersContainer.appendChild(answerElement);
        });
        
        // Обновляем навигацию
        this.updateQuestionNavigation();
        
        // Обновляем кнопки навигации
        this.updateNavigationButtons();
        
        // Показываем кнопки навигации, если ответ уже дан
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.nextQuestionBtn.classList.remove('hidden');
            } else {
                this.finishQuizBtn.classList.remove('hidden');
            }
        } else {
            this.nextQuestionBtn.classList.add('hidden');
            this.finishQuizBtn.classList.add('hidden');
        }
    }

    createQuestionNavigation() {
        this.questionsGrid.innerHTML = '';
        
        this.questions.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.className = 'question-nav-btn';
            btn.textContent = index + 1;
            btn.onclick = () => this.goToQuestion(index);
            this.questionsGrid.appendChild(btn);
        });
        
        this.updateQuestionNavigation();
    }

    updateQuestionNavigation() {
        const buttons = this.questionsGrid.querySelectorAll('.question-nav-btn');
        
        buttons.forEach((btn, index) => {
            // Убираем все классы статуса
            btn.classList.remove('current', 'answered', 'correct', 'incorrect');
            
            // Добавляем класс текущего вопроса
            if (index === this.currentQuestionIndex) {
                btn.classList.add('current');
            }
            
            // Добавляем классы статуса ответа
            if (this.userAnswers[index] !== undefined) {
                btn.classList.add('answered');
                
                const isCorrect = this.userAnswers[index] === this.questions[index].correctAnswer;
                if (isCorrect) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('incorrect');
                }
            }
        });
    }

    updateNavigationButtons() {
        // Кнопка "Предыдущий"
        if (this.currentQuestionIndex > 0) {
            this.prevQuestionBtn.classList.remove('hidden');
        } else {
            this.prevQuestionBtn.classList.add('hidden');
        }
        
        // Кнопка "Следующий" / "Завершить"
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.nextQuestionBtn.classList.remove('hidden');
            this.finishQuizBtn.classList.add('hidden');
        } else {
            this.nextQuestionBtn.classList.add('hidden');
            this.finishQuizBtn.classList.remove('hidden');
        }
    }

    goToQuestion(index) {
        this.currentQuestionIndex = index;
        this.displayQuestion();
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    selectAnswer(selectedIndex) {
        const answerElements = this.answersContainer.querySelectorAll('.answer-option');
        
        // Убираем предыдущий выбор
        answerElements.forEach(el => el.classList.remove('selected'));
        
        // Выделяем выбранный ответ
        answerElements[selectedIndex].classList.add('selected');
        
        // Сохраняем ответ пользователя
        this.userAnswers[this.currentQuestionIndex] = selectedIndex;
        
        // Обновляем навигацию
        this.updateQuestionNavigation();
        
        // Показываем кнопку "Следующий вопрос" или "Завершить квиз"
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.nextQuestionBtn.classList.remove('hidden');
        } else {
            this.finishQuizBtn.classList.remove('hidden');
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    finishQuiz() {
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.score++;
            }
        });
    }

    showResults() {
        this.quizSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.scorePercentage.textContent = `${percentage}%`;
        this.correctAnswers.textContent = this.score;
        this.totalAnswers.textContent = this.questions.length;
        
        // Показываем кнопку "Посмотреть ошибки" только если есть неправильные ответы
        const incorrectCount = this.questions.length - this.score;
        if (incorrectCount > 0) {
            this.reviewErrorsBtn.classList.remove('hidden');
        } else {
            this.reviewErrorsBtn.classList.add('hidden');
        }
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.showQuiz();
        this.displayQuestion();
    }

    chooseCategory() {
        this.resultsSection.classList.add('hidden');
        this.reviewSection.classList.add('hidden');
        this.categorySelection.classList.remove('hidden');
        this.loadCategories();
    }

    showReview() {
        this.resultsSection.classList.add('hidden');
        this.reviewSection.classList.remove('hidden');
        
        // Обновляем статистику
        const totalQuestions = this.questions.length;
        const correctCount = this.score;
        const incorrectCount = totalQuestions - correctCount;
        
        this.totalQuestionsReview.textContent = totalQuestions;
        this.correctAnswersReview.textContent = correctCount;
        this.incorrectAnswersReview.textContent = incorrectCount;
        
        // Отображаем все вопросы
        this.displayAllQuestions();
        
        // Отображаем только неправильные ответы
        this.displayIncorrectQuestions();
    }

    backToResults() {
        this.reviewSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
    }

    displayAllQuestions() {
        this.allQuestionsList.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            const questionElement = this.createQuestionReviewElement(question, userAnswer, isCorrect, index + 1);
            this.allQuestionsList.appendChild(questionElement);
        });
    }

    displayIncorrectQuestions() {
        this.incorrectQuestionsList.innerHTML = '';
        
        const incorrectQuestions = this.questions.filter((question, index) => {
            const userAnswer = this.userAnswers[index];
            return userAnswer !== question.correctAnswer;
        });
        
        if (incorrectQuestions.length === 0) {
            this.incorrectQuestionsList.innerHTML = `
                <div class="no-results">
                    <h3>🎉 Отлично!</h3>
                    <p>У вас нет неправильных ответов!</p>
                </div>
            `;
            return;
        }
        
        let questionIndex = 1;
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            if (!isCorrect) {
                const questionElement = this.createQuestionReviewElement(question, userAnswer, isCorrect, questionIndex);
                this.incorrectQuestionsList.appendChild(questionElement);
                questionIndex++;
            }
        });
    }

    createQuestionReviewElement(question, userAnswer, isCorrect, questionNumber) {
        const questionDiv = document.createElement('div');
        questionDiv.className = `question-review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        const questionText = document.createElement('div');
        questionText.className = 'question-review-text';
        questionText.textContent = `${questionNumber}. ${question.question}`;
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'question-review-options';
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'review-option';
            
            const label = document.createElement('span');
            label.className = 'review-option-label';
            label.textContent = String.fromCharCode(65 + index) + '.';
            
            const text = document.createElement('span');
            text.textContent = option;
            
            optionDiv.appendChild(label);
            optionDiv.appendChild(text);
            
            // Добавляем классы для стилизации
            if (index === userAnswer) {
                optionDiv.classList.add('user-answer');
            }
            if (index === question.correctAnswer) {
                optionDiv.classList.add('correct-answer');
            }
            
            optionsDiv.appendChild(optionDiv);
        });
        
        questionDiv.appendChild(questionText);
        questionDiv.appendChild(optionsDiv);
        
        return questionDiv;
    }

    switchTab(tabName) {
        // Скрываем все вкладки
        document.querySelectorAll('.review-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Убираем активный класс со всех кнопок
        this.tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Показываем выбранную вкладку
        document.getElementById(tabName).classList.add('active');
        
        // Активируем соответствующую кнопку
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    displayError(message) {
        this.categoriesGrid.innerHTML = `
            <div class="error-message" style="text-align: center; color: #f56565; padding: 20px;">
                <h3>Ошибка</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Обновить страницу</button>
            </div>
        `;
    }

    bindEvents() {
        this.nextQuestionBtn.onclick = () => this.nextQuestion();
        this.prevQuestionBtn.onclick = () => this.prevQuestion();
        this.finishQuizBtn.onclick = () => this.finishQuiz();
        this.restartQuizBtn.onclick = () => this.restartQuiz();
        this.chooseCategoryBtn.onclick = () => this.chooseCategory();
        this.reviewErrorsBtn.onclick = () => this.showReview();
        this.backToResultsBtn.onclick = () => this.backToResults();
        
        // События поиска
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.showSuggestions();
            this.filterCategories();
        });
        
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });
        
        // События вкладок разбора ошибок
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // Скрываем предложения при клике вне поля поиска
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchSuggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
}

// Инициализация приложения при загрузке страницы
let quizApp;
document.addEventListener('DOMContentLoaded', () => {
    quizApp = new QuizApp();
});
