// Образец переведенных вопросов
const quizData = {
    'general': [
        {
            question: "Этот напиток содержит кофеин.",
            options: ["апельсиновый сок", "Пиво", "Кофе", "Минеральная вода"],
            correctAnswer: 2
        },
        {
            question: "Если телепрограмме присвоен рейтинг G, то это правда.",
            options: ["Он подходит для маленьких детей.", "Он подходит для любой аудитории.", "Содержит легкие сексуальные ситуации.", "Содержит умеренное насилие."],
            correctAnswer: 1
        },
        {
            question: "Этим человеком была введена в физику теория относительности.",
            options: ["Архимед", "Альберт Эйнштейн", "Галилео Галилей", "Исаак Ньютон"],
            correctAnswer: 1
        },
        {
            question: "Вот символ химического элемента железа.",
            options: ["я", "Зн", "Бр", "Фе"],
            correctAnswer: 3
        },
        {
            question: "Автор романа «Портрет художника в юности» — этот писатель.",
            options: ["Сэмюэл Беккет", "Джеймс Джойс", "Т. С. Элиот", "Уильям Фолкнер"],
            correctAnswer: 1
        }
    ]
};

// Функции
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
}