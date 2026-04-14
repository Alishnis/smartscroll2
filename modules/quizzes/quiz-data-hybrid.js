// Гибридная база данных квизов - русские и английские вопросы
const quizData = {
    'general': [
        {
            question: "Какая планета ближе всего к Солнцу?",
            options: ["Венера", "Меркурий", "Марс", "Земля"],
            correctAnswer: 1
        },
        {
            question: "Сколько континентов на Земле?",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2
        },
        {
            question: "Какая самая длинная река в мире?",
            options: ["Амазонка", "Нил", "Янцзы", "Миссисипи"],
            correctAnswer: 1
        },
        {
            question: "В каком году был основан Санкт-Петербург?",
            options: ["1700", "1703", "1705", "1710"],
            correctAnswer: 1
        },
        {
            question: "Кто написал роман \"Война и мир\"?",
            options: ["Достоевский", "Толстой", "Чехов", "Тургенев"],
            correctAnswer: 1
        },
        {
            question: "Какая столица Австралии?",
            options: ["Сидней", "Мельбурн", "Канберра", "Перт"],
            correctAnswer: 2
        },
        {
            question: "Сколько дней в високосном году?",
            options: ["365", "366", "364", "367"],
            correctAnswer: 1
        },
        {
            question: "Какая самая высокая гора в мире?",
            options: ["К2", "Эверест", "Килиманджаро", "Аннапурна"],
            correctAnswer: 1
        },
        {
            question: "В каком океане находится Марианская впадина?",
            options: ["Атлантический", "Тихий", "Индийский", "Северный Ледовитый"],
            correctAnswer: 1
        },
        {
            question: "Кто изобрел лампочку?",
            options: ["Эдисон", "Тесла", "Белл", "Маркони"],
            correctAnswer: 0
        }
    ],
    'science-technology': [
        {
            question: "Какая формула воды?",
            options: ["H2O", "CO2", "NaCl", "O2"],
            correctAnswer: 0
        },
        {
            question: "Сколько хромосом у человека?",
            options: ["44", "46", "48", "50"],
            correctAnswer: 1
        },
        {
            question: "Какая скорость света в вакууме?",
            options: ["300,000 км/с", "150,000 км/с", "450,000 км/с", "600,000 км/с"],
            correctAnswer: 0
        },
        {
            question: "Что такое ДНК?",
            options: ["Белок", "Нуклеиновая кислота", "Углевод", "Липид"],
            correctAnswer: 1
        },
        {
            question: "Какая самая близкая звезда к Земле?",
            options: ["Проксима Центавра", "Солнце", "Сириус", "Альфа Центавра"],
            correctAnswer: 1
        },
        {
            question: "Что означает аббревиатура \"AI\"?",
            options: ["Искусственный интеллект", "Автоматизация информации", "Анализ данных", "Интернет вещей"],
            correctAnswer: 0
        },
        {
            question: "Какая единица измерения электрического тока?",
            options: ["Вольт", "Ампер", "Ом", "Ватт"],
            correctAnswer: 1
        },
        {
            question: "Что такое фотосинтез?",
            options: ["Дыхание растений", "Поглощение света растениями", "Размножение растений", "Рост растений"],
            correctAnswer: 1
        },
        {
            question: "Какая температура кипения воды при нормальном давлении?",
            options: ["90°C", "100°C", "110°C", "120°C"],
            correctAnswer: 1
        },
        {
            question: "Что такое гравитация?",
            options: ["Электромагнитная сила", "Сила притяжения", "Ядерная сила", "Слабая сила"],
            correctAnswer: 1
        }
    ],
    'history': [
        {
            question: "В каком году началась Вторая мировая война?",
            options: ["1937", "1938", "1939", "1940"],
            correctAnswer: 2
        },
        {
            question: "Кто был первым президентом США?",
            options: ["Джон Адамс", "Томас Джефферсон", "Джордж Вашингтон", "Бенджамин Франклин"],
            correctAnswer: 2
        },
        {
            question: "В каком году пала Берлинская стена?",
            options: ["1987", "1989", "1991", "1993"],
            correctAnswer: 1
        },
        {
            question: "Кто написал \"Капитал\"?",
            options: ["Ленин", "Маркс", "Энгельс", "Сталин"],
            correctAnswer: 1
        },
        {
            question: "В каком веке жил Наполеон Бонапарт?",
            options: ["XVII", "XVIII", "XIX", "XX"],
            correctAnswer: 2
        },
        {
            question: "Какая империя была самой большой в истории?",
            options: ["Римская", "Британская", "Монгольская", "Российская"],
            correctAnswer: 1
        },
        {
            question: "В каком году произошла Октябрьская революция?",
            options: ["1916", "1917", "1918", "1919"],
            correctAnswer: 1
        },
        {
            question: "Кто открыл Америку?",
            options: ["Васко да Гама", "Христофор Колумб", "Фернан Магеллан", "Америго Веспуччи"],
            correctAnswer: 1
        },
        {
            question: "В каком году был основан Рим?",
            options: ["753 до н.э.", "753 н.э.", "753 до н.э.", "753 н.э."],
            correctAnswer: 0
        },
        {
            question: "Кто был последним императором России?",
            options: ["Александр III", "Николай II", "Александр II", "Павел I"],
            correctAnswer: 1
        }
    ],
    'geography': [
        {
            question: "Какая самая большая страна в мире?",
            options: ["Канада", "Китай", "Россия", "США"],
            correctAnswer: 2
        },
        {
            question: "В каком океане находится Гавайи?",
            options: ["Атлантический", "Тихий", "Индийский", "Северный Ледовитый"],
            correctAnswer: 1
        },
        {
            question: "Какая столица Бразилии?",
            options: ["Рио-де-Жанейро", "Сан-Паулу", "Бразилиа", "Сальвадор"],
            correctAnswer: 2
        },
        {
            question: "Сколько штатов в США?",
            options: ["48", "49", "50", "51"],
            correctAnswer: 2
        },
        {
            question: "Какая самая длинная река в Европе?",
            options: ["Дунай", "Волга", "Рейн", "Сена"],
            correctAnswer: 1
        },
        {
            question: "В какой стране находится Мачу-Пикчу?",
            options: ["Мексика", "Перу", "Боливия", "Чили"],
            correctAnswer: 1
        },
        {
            question: "Какая самая высокая гора в Африке?",
            options: ["Килиманджаро", "Эльбрус", "Монблан", "Аконкагуа"],
            correctAnswer: 0
        },
        {
            question: "В каком полушарии находится Австралия?",
            options: ["Северном", "Южном", "Восточном", "Западном"],
            correctAnswer: 1
        },
        {
            question: "Какая столица Канады?",
            options: ["Торонто", "Ванкувер", "Оттава", "Монреаль"],
            correctAnswer: 2
        },
        {
            question: "Сколько океанов на Земле?",
            options: ["4", "5", "6", "7"],
            correctAnswer: 1
        }
    ],
    'animals': [
        {
            question: "Какое животное самое быстрое на суше?",
            options: ["Лев", "Гепард", "Антилопа", "Лошадь"],
            correctAnswer: 1
        },
        {
            question: "Сколько сердец у осьминога?",
            options: ["1", "2", "3", "4"],
            correctAnswer: 2
        },
        {
            question: "Какое животное самое большое в мире?",
            options: ["Слон", "Синий кит", "Жираф", "Бегемот"],
            correctAnswer: 1
        },
        {
            question: "Сколько ног у паука?",
            options: ["6", "8", "10", "12"],
            correctAnswer: 1
        },
        {
            question: "Какое животное спит больше всего?",
            options: ["Кот", "Ленивец", "Коала", "Хомяк"],
            correctAnswer: 1
        },
        {
            question: "Сколько камер в сердце рыбы?",
            options: ["1", "2", "3", "4"],
            correctAnswer: 1
        },
        {
            question: "Какое животное может поворачивать голову на 270°?",
            options: ["Сова", "Орел", "Попугай", "Фламинго"],
            correctAnswer: 0
        },
        {
            question: "Сколько зубов у акулы?",
            options: ["Около 50", "Около 100", "Около 300", "Около 1000"],
            correctAnswer: 2
        },
        {
            question: "Какое животное не может прыгать?",
            options: ["Слон", "Бегемот", "Носорог", "Все вышеперечисленные"],
            correctAnswer: 3
        },
        {
            question: "Сколько лет может жить черепаха?",
            options: ["50-80 лет", "80-120 лет", "120-200 лет", "200+ лет"],
            correctAnswer: 2
        }
    ]
};

// Функция для получения случайных вопросов из категории
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
}