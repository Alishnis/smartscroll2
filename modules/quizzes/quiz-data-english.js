// Данные квизов - загружены из OpenTriviaQA датасета
const quizData = {
    'music': [
        {
            question: "The controversial lyrics of this song by The Rolling Stones include, Its Down to me, the way she talks when shes spoken to",
            options: ["Heart of Stone", "Under My Thumb", "Play With Fire", "Its All Over Now"],
            correctAnswer: 1
        },
        {
            question: "Mick Jagger sings Baby, baby, theres fever in the funk house now on this song.",
            options: ["Street Fighting Man", "Jumpin Jack Flash", "Gimme Shelter", "Tumbling Dice"],
            correctAnswer: 3
        },
        {
            question: "Lose Your Dreams and you will lose your mind are lyrics from this 1967 hit by The Rolling Stones.",
            options: ["Ruby Tuesday", "(I Cant Get No) Satisfaction", "As Tears Go By", "Shes A Rainbow"],
            correctAnswer: 0
        },
        {
            question: "Part of this song by The Rolling Stones goes, We decided that we would have a soda - my favorite flavor, cherry red?",
            options: ["Mothers Little Helper", "Hot Stuff", "You Cant Always Get What You Want", "Jumpin Jack Flash"],
            correctAnswer: 2
        },
        {
            question: "The lyrics of this song by the Rolling Stones include the phrase Rape, murder!",
            options: ["Sympathy for the Devil", "Gimme Shelter", "Harlem Shuffle", "Street Fighting Man"],
            correctAnswer: 1
        },
        {
            question: "Jon Bon Jovi, Richie Sambora, Alex John Such, Tico Torres, Dave Bryan",
            options: ["Whitesnake", "Cinderella", "Def Leppard", "Bon Jovi"],
            correctAnswer: 3
        },
        {
            question: "Don Dokken, George Lynch, Jeff Pilson, Mick Brown",
            options: ["Guns N Roses", "Dokken", "Faster Pussycat", "L. A. Guns"],
            correctAnswer: 1
        },
        {
            question: "Bret Michaels, Bobby Dall, Rikki Rockett, C.C DeVille",
            options: ["New York Dolls", "Motley Crue", "Cinderella", "Poison"],
            correctAnswer: 3
        },
        {
            question: "Fred Coury, Tom Keifer, Eric Brittingham, Jeff LaBar",
            options: ["Whitesnake", "Cinderella", "Great White", "Ratt"],
            correctAnswer: 1
        },
        {
            question: "David Coverdale, Rudy Sarzo, Tommy Aldridge, Steve Vai",
            options: ["Great White", "Whitesnake", "Tesla", "Poison"],
            correctAnswer: 1
        },
        {
            question: "Dave The Snake Sabo, Rachel Bolan, Sebastian Bach, Rob Affuso, Scott Hill",
            options: ["W.A.S.P", "Bon Jovi", "Motley Crue", "Skid Row"],
            correctAnswer: 3
        },
        {
            question: "Tommy Lee, Vince Neil, Nikki Sixx, Mick Mars",
            options: ["Whitesnake", "Poison", "Great White", "Motley Crue"],
            correctAnswer: 3
        },
        {
            question: "Audie Desbrow, Jack Russell, Michael Lardie, Tony Montana, Mark Kendall",
            options: ["Poison", "Whitesnake", "Great White", "Motley Crue"],
            correctAnswer: 2
        },
        {
            question: "Troy Luccketta, Brian Wheat, Frank Hannon, Tommy Skeoch, Jeff Keith",
            options: ["Iron Maiden", "Twisted Sister", "Metallica", "Tesla"],
            correctAnswer: 3
        },
        {
            question: "James Hetfield, Lars Ulrich, Kirk Hammett, Jason Newsted",
            options: ["Twisted Sister", "Metal Church", "Metallica", "Testament"],
            correctAnswer: 2
        },
        {
            question: "Every breath you take",
            options: ["very bond you break", "step you take", "step you make", "very move you make", "time you shake", "very ...", "cake you bake"],
            correctAnswer: 1
        },
        {
            question: "Well I guess it would be nice",
            options: ["Has such a body", "Has got a body like you", "Has it like you", "Does the dishes like you"],
            correctAnswer: 1
        },
        {
            question: "Everybodys talking all this stuff about me",
            options: ["Make my own decisions oh", "This really is my vision oh", "Dont you know my precision oh", "Ready for collision oh"],
            correctAnswer: 0
        },
        {
            question: "If I fail, if I succeed",
            options: ["I will still be", "They cant take away my dignity", "They cant take away my beat", "t least Ill live as I believe", "They cant make me lose my dignity"],
            correctAnswer: 1
        },
        {
            question: "Sleight of hand and twist of fate",
            options: ["but i want more", "but im not sure", "and i feel sure", "nd I wait without you", "and then some more"],
            correctAnswer: 0
        },
        {
            question: "That its only the thrill",
            options: ["biological", "physical", "possible", "logical"],
            correctAnswer: 3
        },
        {
            question: "I have seen the writing on the wall.",
            options: ["ll in all it was all just ...", "blocks in the wall", "tracks in the snow", "ont think I need anything at all.", "flies on the wall", "bricks in the wall"],
            correctAnswer: 5
        },
        {
            question: "Gonna give you all my love, boy",
            options: ["it is all past", "only love can last", "youre my last", "a spell was cast", "een saving it all for you"],
            correctAnswer: 1
        },
        {
            question: "And shell tease you",
            options: ["make you rush", "ll the better just to please ya", "win your trust", "make a pro blush", "make you crash"],
            correctAnswer: 3
        },
        {
            question: "Burning the ground I break from the crowd",
            options: ["Im lost and Im found", "because Im a hound", "I feel that you are around", "my heart was just found"],
            correctAnswer: 0
        },
        {
            question: "This was the first digitally recorded track to become a hit in 1980.",
            options: ["We Dont Talk anymore", "Mirror in the Bathroom", "Zenyatta Mondatta", "Dirk Wears White Soxs"],
            correctAnswer: 1
        },
        {
            question: "This song was the top single in 1981.  This song broke the US Top 100 chart longevity record by spending 106 weeks on it.",
            options: ["Oh Julie", "Dead Ringer", "Tainted Love", "One Day in Your Life"],
            correctAnswer: 2
        },
        {
            question: "This hit of Olivia Newton-John and its video made athletic wear fashionable in 1981.",
            options: ["Physical", "Synchronicity", "Karma Chameleon", "Blue Monday"],
            correctAnswer: 0
        },
        {
            question: "In 1983 Michael Jackson released this album which sold more than 25 million copies.",
            options: ["Bad", "Dangerous", "Blood on the Dance Floor", "Thriller"],
            correctAnswer: 3
        },
        {
            question: "This was the first western group to perform in China. They went there in 1985.",
            options: ["The Smiths", "Dire Straits", "Wham!", "The Bee Gees"],
            correctAnswer: 2
        },
        {
            question: "In 1987 this album of Guns N Roses made huge success on both sides of the Atlantic. In the UK it stayed on the charts for 131 weeks and in the US it was on for 147 weeks.",
            options: ["Lose Your Illusion I", "14 Years", "Appetite For Destruction", "Lose Your Illusion II"],
            correctAnswer: 2
        },
        {
            question: "In 1981 MTV was first shown in this city, and the first video to be broadcasted was Video Killed the Radio Star by The Buggles.",
            options: ["New York", "Miami", "Washington", "San Francisco"],
            correctAnswer: 0
        },
        {
            question: "In 1988 this song by Bobby McFerrin became one of the most overplayed songs of the century.",
            options: ["Dont Worry, Be Happy", "Circlesongs", "Bang! Zoom", "Beyond Words"],
            correctAnswer: 0
        },
        {
            question: "This was the last number 1 album of Police with the hit single Every breath you take. It appeared on the UK charts in 1983.",
            options: ["Synchronicity", "Zenyatta Mondatta", "Reggatta De Blanc", "Ghost In The Machine"],
            correctAnswer: 0
        },
        {
            question: "This was probably one of the most shocking deaths during the 80s. On December 8, 1980 this member of the Beatles was shot.",
            options: ["Ringo Starr", "Paul McCartney", "John Lennon", "George Harrison"],
            correctAnswer: 2
        },
        {
            question: "Six oclock already I was just in the middle of a dream",
            options: ["Go-Gos", "Heart", "Bangles", "Bananarama"],
            correctAnswer: 2
        },
        {
            question: "And there are voices that want to be heard",
            options: ["Blondie", "Bangles", "Roxette", "Kim Carnes"],
            correctAnswer: 2
        },
        {
            question: "Fab Five Freddy told me everybody was fly",
            options: ["J spinning I said, My, My", "Cyndi Lauper", "Go-Gos", "Annie Lennox", "Blondie"],
            correctAnswer: 4
        },
        {
            question: "Lying in my bed I hear the clock tick and think of you",
            options: ["Cyndi Lauper", "aught up in circles confusion is nothing new", "Bananarama", "Roxette", "Kim Carnes"],
            correctAnswer: 0
        },
        {
            question: "Goddess on a mountain top burning like a silver flame",
            options: ["Go-Gos", "Bananarama", "Roxette", "Bangles"],
            correctAnswer: 1
        },
        {
            question: "Then it happened one day, we came round the same way",
            options: ["Heart", "Bangles", "Blondie", "Cyndi Lauper"],
            correctAnswer: 0
        },
        {
            question: "Show me a smile then,",
            options: ["Annie Lennox", "ont be unhappy, cant remember", "Cyndi Lauper", "Blondie", "Pat Benetar"],
            correctAnswer: 2
        },
        {
            question: "We are young, heartache to heartache we stand",
            options: ["Kim Carnes", "Cyndi Lauper", "Blondie", "Pat Benatar"],
            correctAnswer: 3
        },
        {
            question: "Do you hear them?",
            options: ["Bananarama", "Go-Gos", "Roxette", "Bangles"],
            correctAnswer: 1
        },
        {
            question: "What country sensation made her acting debut in Tremors?",
            options: ["LeAnn Rimes", "Dolly Parton", "Tanya Tucker", "Reba McEntire"],
            correctAnswer: 3
        },
        {
            question: "What county singer starred in the move,The Gambler?",
            options: ["Travis Trit", "Dwight Yoakam", "Kenny Rogers", "George Jones"],
            correctAnswer: 2
        },
        {
            question: "This country singer made her debut in Nine to Five.",
            options: ["Reba McIntire", "Naomi Judd", "Tanya Tucker", "Dolly Parton"],
            correctAnswer: 3
        },
        {
            question: "This country star, who starred in Slingblade, has been to Hollywood more than once.",
            options: ["George strait", "Willie nelson", "Dwight Yoakam", "Randy Travis"],
            correctAnswer: 2
        },
        {
            question: "This country star has acted with some of the best, as he did in the movie, Black Dog.",
            options: ["Travis Tritt", "Tim McGraw", "Randy Travis", "Willie nelson"],
            correctAnswer: 2
        },
        {
            question: "This country singer preached a great sermon in the movie, The Redheaded Stranger.",
            options: ["Johnny Cash", "Travis Tritt", "Willie Nelson", "Randy Travis"],
            correctAnswer: 2
        }
    ],
    'hobbies': [
        {
            question: "If youve ordered a burn one, take it through the garden, pin a rose on it, what can you expect to be placed in front of you?",
            options: ["Lamb Shish - Kabob", "Tuna Melt on Rye with Lettuce and Dill Chips", "Hamburger with Lettuce, Tomato and Onion", "Hot Dog with Chili and Coleslaw"],
            correctAnswer: 2
        },
        {
            question: "If the girl next to you orders baled hay, life preserver and java for breakfast, what has she ordered?",
            options: ["Cream of wheat , donut and coffee", "Hash browns, omelet, and coffee", "Shredded wheat, donut and coffee", "Buckwheat pancakes, danish, and coffee"],
            correctAnswer: 2
        },
        {
            question: "Noahs Boy refers to a fish sandwich.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Its your first day on the job at your favorite diner!  The waitress next to you yells out to the short order cook that she needs two cows, make them cry, and paint em red.  What has she requested the short order cook to prepare?",
            options: ["Salisbury steak with American sauce.", "Two hamburgers with onions, cover in ketchup", "Double cheeseburger, no onions, special sauce", "Two orders of beef liver and onions with ketchup"],
            correctAnswer: 1
        },
        {
            question: "Your friends favorite breakfast is a shingle with shimmy and shake, squeeze one.   What does he like to eat for breakfast?",
            options: ["Short stack of pancakes and instant coffee", "French toast and apple juice", "Buttered toast with jam and orange juice", "Link sausage,  toast and juice"],
            correctAnswer: 2
        },
        {
            question: "A guy orders a drag it through Georgia for his son.  What has he ordered?",
            options: ["A slice of key lime pie", "Chili dog, all the way", "Cola with chocolate syrup", "Fried chicken basket"],
            correctAnswer: 2
        },
        {
            question: "What is diner-speak for an order of hash?",
            options: ["Customer will take a chance", "Pittsburgh", "Burn the British", "Gravel train"],
            correctAnswer: 0
        },
        {
            question: "Mom always told you to get plenty of iron in your diet, so you order a put out the lights and cry.  What item have you ordered?",
            options: ["Patty melt, no onions", "Ham on rye with soup", "T - Bone steak with onions", "Liver and onions"],
            correctAnswer: 3
        },
        {
            question: "Keep off the grass in diner-speak means this.",
            options: ["No parsley", "Tomato only", "Like the sign says...", "Hold the lettuce"],
            correctAnswer: 3
        },
        {
            question: "The final order of the night is for a Bow - wow, Pittsburgh on the bun, frog sticks, and a 55 with Hail.  What has been ordered?",
            options: ["Kielbasa, extra mustard, frog legs and a chocolate shake.", "Bacon wrapped steak with fries and black coffee.", "Hot dog, burn or toast the bun, side of french fries and a root beer with ice.", "Bratwurst, no bun, mashed potatoes, cherry coke with Ice."],
            correctAnswer: 2
        },
        {
            question: "A fellow comes in on the night shift and orders a Hockey puck with wax, wreck em, frog sticks in the alley, and draw one in the dark.  What on Earth does he want to eat?",
            options: ["Well done burger with American cheese, fries on the side, scrambled eggs, and black coffee.", "Medium-rare burger, onion rings, fries, and a strawberry shake.", "Liver, no onions, frog legs, fried eggs, and black coffee.", "Tuna salad with cheese, fries on the side and black forest cake."],
            correctAnswer: 0
        },
        {
            question: "Chicks on a raft with blowout patches refers to what?",
            options: ["Scrambled eggs and sausage", "Western omelet with french toast", "Fried chicken and mashed potatoes", "Eggs on toast with pancakes"],
            correctAnswer: 3
        },
        {
            question: "Finally, a customer orders Bossy in a bowl, bullets or whistleberries, a blonde with sand, a bucket of cold mud, and belchwater.  What have they ordered?",
            options: ["Tomato soup, fried okra, root beer, chocolate ice cream, and Perrier water.", "Beef stew, baked beans, coffee with cream and sugar, chocolate ice cream, and seltzer water.", "Chicken noodle soup, blackberries, vanilla coke, German chocolate cake and seltzer water.", "Chili con carne with Lima beans, ice tea, a vanilla sundae and a Perrier water."],
            correctAnswer: 1
        },
        {
            question: "Due to the shape of its fruits, Aztecs called this tree Ahuacuatl, which meant testicle tree.",
            options: ["Banana", "Avocado", "Pear", "Apple"],
            correctAnswer: 1
        },
        {
            question: "This fruit is generally considered to grow on a tree, but the tree is actually a giant herb. The fruit contains potassium and vitamin B, which are necessary for the production of sex hormones.",
            options: ["Peach", "Cherry", "Banana", "Strawberry"],
            correctAnswer: 2
        },
        {
            question: "This food is a very good source of energy. It also contains phenylethylamine, which triggers the same reaction in the body as falling in love does.",
            options: ["Chocolate", "Honey", "Sugar", "Beeswax"],
            correctAnswer: 0
        },
        {
            question: "Although too smelly, this member of the onion family is considered to be an aphrodisiac. It also has antioxidant properties and is used in alternative medicine.",
            options: ["Garlic", "Spinach", "Celery", "Leeks"],
            correctAnswer: 0
        },
        {
            question: "Although natural, this food contains more calories than beet-sugar. It is used in a lot of skin-care products, but in the ancient Egyptians considered it --to be a cure for impotence and sterility.",
            options: ["Avocado", "Cinnamon", "Chocolate", "Honey"],
            correctAnswer: 3
        },
        {
            question: "This very nutritious and rich in proteins seafood is stated to be the favourite one of Casanova. He was famous as one of the worlds greatest lovers and an ardent connoisseur of this food, which was always on his menu.",
            options: ["Crabs", "Oysters", "Leeks", "Fish"],
            correctAnswer: 1
        },
        {
            question: "These fruits were used as wedding breakfast in France. Newlyweds had a soup of thinned sour cream, borage and powdered sugar, and these.",
            options: ["Strawberries", "Blackcurrant", "Cherries", "Peaches"],
            correctAnswer: 0
        },
        {
            question: "As this drink relaxes and stimulates the senses, it is considered the proper drink for a romantic evening. The recommended quantity is one or two glasses, otherwise you will get sleepy and spoil the moment.",
            options: ["Tea", "Wine", "Whisky", "Coffee"],
            correctAnswer: 1
        },
        {
            question: "This drink is a widely known stimulant, but if you have too much, it becomes a depressant. Its active ingredient - caffeine - is known as the worlds most popular drug.",
            options: ["Coffee", "Water", "Tea", "Orange juice"],
            correctAnswer: 0
        },
        {
            question: "Having been cultivated for more than 1000 years, this is one of the oldest spices in the world. However, you should be aware of its hallucinogenic properties it taken in large quantities. In Asia, It was highly appreciated for its aphrodisiac qualities.",
            options: ["Cinnamon", "Black pepper", "Turmeric powder", "Nutmeg"],
            correctAnswer: 3
        },
        {
            question: "Whisky is traditional for this country. The beverages color can give you a hint about its age.",
            options: ["Wales", "Scotland", "Ireland", "USA"],
            correctAnswer: 1
        },
        {
            question: "Tequila is named after a town with the same name in the country where it is a traditional drink.",
            options: ["Mexico", "Portugal", "Chile", "Spain"],
            correctAnswer: 0
        },
        {
            question: "Vodka is traditional for this country. People there like to flavor vodka with lemon peel, pepper or herbs.",
            options: ["Romania", "Macedonia", "Russia", "Ukraine"],
            correctAnswer: 2
        },
        {
            question: "Rakia is a strong alcoholic drink made of various fruits, usually grapes, plums or apricots.",
            options: ["Russia", "Hungary", "Bulgaria", "Finland"],
            correctAnswer: 2
        },
        {
            question: "Pastis is the most popular aperitif in this country. It is made with anise, licorice and additional aromatic plants.",
            options: ["Germany", "Switzerland", "Italy", "France"],
            correctAnswer: 3
        },
        {
            question: "In this country people drink gorilka. It is similar to vodka.",
            options: ["Belarus", "Azerbaijan", "Ukraine", "Georgia"],
            correctAnswer: 2
        },
        {
            question: "Sangria is consumed all year round in this country. It is made of wine mixed with fruit and spices.",
            options: ["Malta", "Argentina", "Spain", "Ecuador"],
            correctAnswer: 2
        },
        {
            question: "Caipirinha takes lime, caster sugar, and Cachaca, or Rum to chill out the citizens of this country.",
            options: ["Mexico", "Hawaii", "Brazil", "Cuba"],
            correctAnswer: 2
        },
        {
            question: "Schnapps is a kind of fruit brandy and is typical for the country which gave the name of this beverage.",
            options: ["The Netherlands", "Germany", "Italy", "Austria"],
            correctAnswer: 1
        },
        {
            question: "Ouzo is the preferred drink in this country. It is produced from pressed grapes, herbs and berries.",
            options: ["Greece", "Turkey", "Hungary", "Macedonia"],
            correctAnswer: 0
        },
        {
            question: "The first sales of the Coca Cola drink were made at Jacobs Pharmacy in Atlanta, Georgia, in what year?",
            options: ["1798", "1886", "1900", "1800"],
            correctAnswer: 1
        },
        {
            question: "Attorneys Benjamin Thomas and Joseph Whitehead of Chattanooga, Tennessee, bought the exclusive rights to distribute Coke syrup to bottlers across most of the US. How much did they pay to obtain the rights?",
            options: ["$100", "$1", "$1000", "$10"],
            correctAnswer: 1
        },
        {
            question: "Coca-Cola used to contain cocaine.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Coca-Cola was originally green.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Why was Coca-Cola once considered an anti-Semitic company?",
            options: ["Coca-Cola did not have a bottling plant in Israel", "The manager of Coca-Colas Egyptian bottling operations announced  that Coca-Cola would never allow the Israelis a franchise", "All of these", "Coca-Cola was successfully doing business in the Middle East"],
            correctAnswer: 2
        },
        {
            question: "This was the original title of a song, produced by Billy Davis and sung by The New Seekers, and featured in a 1971 TV commercial of Coca Cola.",
            options: ["Id Like to Teach the World to Sing", "In Perfect Harmony", "None of these", "Id Like to Buy the World a Coke"],
            correctAnswer: 0
        },
        {
            question: "The acids which the Coca-Cola beverage contains make it harmful to drink.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "This zodiac sign is referred to as the youngest one. It is ruled by Mars and is famous as the initiator.",
            options: ["Leo", "Taurus", "Aries", "Sagittarius"],
            correctAnswer: 2
        },
        {
            question: "This sign is ruled by Venus and people born under it are known as peacemakers.",
            options: ["Pisces", "Aquarius", "Capricorn", "Libra"],
            correctAnswer: 3
        },
        {
            question: "This zodiac sign is ruled by the Sun.",
            options: ["Leo", "Aquarius", "Sagittarius", "Virgo"],
            correctAnswer: 0
        },
        {
            question: "Ruled by Saturn, people born under this zodiac sign, are ambitious and practical.",
            options: ["Capricorn", "Taurus", "Pisces", "Sagittarius"],
            correctAnswer: 0
        },
        {
            question: "Under the influence of Jupiter, people born under this sign always seek to extract meaning from experience and search for what lies behind the animal instinct. Having rather philosophical view towards life, a person under this sign will not maintain a relationship with a jealous spouse.",
            options: ["Sagittarius", "Virgo", "Gemini", "Cancer"],
            correctAnswer: 0
        },
        {
            question: "Ruled by Mercury, people born under this sign are really clever. It is typical for them to constantly try to separate what is useful from what is not.",
            options: ["Pisces", "Sagittarius", "Leo", "Virgo"],
            correctAnswer: 3
        },
        {
            question: "The people born under this zodiac sign are ruled by Neptune. They are probably the most sensitive of all, but have worked out a manner to conceal their sensitivity. They are prone to living their life in a constant daydream.",
            options: ["Pisces", "Sagittarius", "Aquarius", "Libra"],
            correctAnswer: 0
        },
        {
            question: "This Moon sign characterizes the people under its rule as maternal. It is typical for them to hold firmly to the past, and to insist on the relation of the present with the past.  However, they are very romantic.",
            options: ["Aquarius", "Cancer", "Virgo", "Leo"],
            correctAnswer: 1
        },
        {
            question: "This astrological sign, ruled by Pluto, has the reputation of being highly sexual. Persons born under it, usually feel emotionally secure if they are financially settled.",
            options: ["Scorpio", "Sagittarius", "Leo", "Aquarius"],
            correctAnswer: 0
        },
        {
            question: "The planet of this sign is Uranus. The most recognizable feature of people born under the sign is their need for independence. They are positive and optimistic, and see life as a wonderful adventure.",
            options: ["Libra", "Aquarius", "Pisces", "Gemini"],
            correctAnswer: 1
        }
    ],
    'literature': [
        {
            question: "What does the word cretin refer to?",
            options: ["Swelling of the cerebrum caused by spinal fluid", "An idiot", "Cyst on the brain stem", "None of these"],
            correctAnswer: 1
        },
        {
            question: "Leaves of Grass",
            options: ["Carl Sandberg", "Robert Frost", "T.S. Eliot", "Walt Whitman"],
            correctAnswer: 3
        },
        {
            question: "At The Mountains of Madness",
            options: ["C.S. Lewis", "Peter Straub", "Edgar Allan Poe", "H.P. Lovecraft"],
            correctAnswer: 3
        },
        {
            question: "Ape and Essance; Eyeless in Gaza; Point Counter Point",
            options: ["Aldous Huxley", "William Butler Yeatts", "Maya Angelou", "J.D. Salinger"],
            correctAnswer: 0
        },
        {
            question: "1984; Animal Farm",
            options: ["Rudyard Kipling", "Aldous Huxley", "Herman Hesse", "George Orwell"],
            correctAnswer: 3
        },
        {
            question: "Return of the Native; Jude the Obscure; Far From the Madding Crowd",
            options: ["Rudyard Kipling", "Thomas Hardy", "James Dickey", "William Faulkner"],
            correctAnswer: 1
        },
        {
            question: "The Antichrist; The Gay Science; Beyond Good and Evil; Thus Spoke Zarathustra",
            options: ["Frederick Nietzche", "none of these", "Amari Baraka", "Stephen King"],
            correctAnswer: 0
        },
        {
            question: "What language can Harry Potter speak?",
            options: ["Mermish", "Parseltounge", "English", "Goblin"],
            correctAnswer: 1
        },
        {
            question: "Cornelia Fudge is the Minister of Magic.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Hermione was supposed to turn into this person after drinking the Polyjuice Potion.",
            options: ["Millie Vanilli", "Millicent Bulstrode", "Crabbe", "Pansy Parkins"],
            correctAnswer: 1
        },
        {
            question: "What was Hagrid buying in Knockturn Alley?",
            options: ["Flesh-Eating Slug Repellent", "Fresh-Skin Slug Repellent", "Flesh-Eating Ant Repellent", "Flesh-Eating Slug Attractor"],
            correctAnswer: 0
        },
        {
            question: "This book by James Joyce was forbidden by the US authorities for 15 years, because it was considered obsene. The ban was lifted in 1933.",
            options: ["Portrait of the Artist", "Ulysses", "Fanny Hill", "Dubliners"],
            correctAnswer: 1
        },
        {
            question: "This book about the life of a prostitute was written by John Cleland. It has been banned in the past due to frank sexual descriptions.",
            options: ["Candide", "Fanny Hill", "Lysistrata", "Decameron"],
            correctAnswer: 1
        },
        {
            question: "This book tells the story of two women who meet and fall in love with each other. They openly declare their homosexuality to family and friends. Thats why the Kansas school system ordered the removal of all copies of this book from high school libraries.",
            options: ["Daddys Roommate", "Catch 22", "Annie on My Mind", "Andersonville"],
            correctAnswer: 2
        },
        {
            question: "This book led Austin Miles to the courts in 1992.  Miles was sued because his book was ...a vitriolic attack upon organized Christianity.",
            options: ["Jerusalem Delivered", "Leaves of Grass", "Dont Call Me Brother", "Dictionary of American Slang"],
            correctAnswer: 2
        },
        {
            question: "This book by Judy Blume was censored as it discussed adolescent sexuality in too much detail.",
            options: ["Freedom and Order", "Forever", "Lolita", "Grapes of Wrath"],
            correctAnswer: 1
        },
        {
            question: "This book by George Orwell was banned as it was pro-communist.",
            options: ["The Sun Also Rises", "1984", "Coming Up for Air", "Deliverance"],
            correctAnswer: 1
        },
        {
            question: "This Lewis Carrolls work was banned in China because in it humans and animals used the same language.",
            options: ["Alices Adventures in Wonderland", "Through The Looking Glass", "The Hunting of the Snark", "Sylvie and Bruno"],
            correctAnswer: 0
        },
        {
            question: "Its translation into local languages was forbidden in Burma.",
            options: ["The Bible", "Arabian Nights", "The Quran", "The Cabala"],
            correctAnswer: 0
        },
        {
            question: "This book was censored in 1985 in Cairo, Egypt as it contained obscene passages which posed a threat to the countrys moral fabric.",
            options: ["Analects", "Don Quixote", "Arabian Nights", "Brave New World"],
            correctAnswer: 2
        },
        {
            question: "An edition of Miltons works was bound in:",
            options: ["Bears fur", "Golden plates", "Human skin", "Used newspapers"],
            correctAnswer: 2
        },
        {
            question: "Binding books with human hide was a common practice once. Why?",
            options: ["Because this sold the books more quickly than anything", "Because of lack of any other proper material", "Because it was fashionable at the time", "Because the narrative in the book was about the story of the hides owner"],
            correctAnswer: 3
        },
        {
            question: "The name of Cruella de Vil from 101 Dalmatians is meaningful because:",
            options: ["She wants the puppies for their fur", "She is the owner of the dalmatians", "She actually likes cats and not dogs", "She doesnt give them any food"],
            correctAnswer: 0
        },
        {
            question: "Who is the Shakespearean villain who had his own brother executed and innocent children killed because they were hindrances to his kingly ambition?",
            options: ["Aaron the Moor", "Richard III", "Othello", "Edmund"],
            correctAnswer: 1
        },
        {
            question: "According to psychologists villains in fairy-tales actually have an important role for the childrens mind formation, namely:",
            options: ["They make the story really funny", "They are interesting models of behaviour", "They always lose the battle", "They help children decide what is bad"],
            correctAnswer: 3
        },
        {
            question: "The famous evil female Baba Yaga comes from:",
            options: ["A Norse legend", "An Uzbekistanian fairy-tale", "Russian folklore", "A Moroccan song"],
            correctAnswer: 2
        },
        {
            question: "Harry Potter is concidered malicious literature by some, because:",
            options: ["It is about witchcraft", "Most of its characters are strange beings", "It comprises too many volulmes", "Its characters are mainly clad in black clothes"],
            correctAnswer: 0
        },
        {
            question: "It turns out that people like reading about crime. The top-selling English-language author of all time is:",
            options: ["Agatha Christie", "Ben Johnson", "Edgar-Allan Poe", "Virginia Woolf"],
            correctAnswer: 0
        },
        {
            question: "Who wrote about the early whodunit archetype, inspector Auguste Dupin?",
            options: ["Georges Sands", "Edgar Allan Poe", "Washington Irving", "Nathaniel Hawthorne"],
            correctAnswer: 1
        },
        {
            question: "Dr. Alex Delaware is the creation of which of these authors?",
            options: ["Jonathan Kellerman", "Ross McDonald", "Kathy Reichs", "Faye Kellerman"],
            correctAnswer: 0
        },
        {
            question: "Robert B. Parker completed Raymond Chandlers unfinished final novel, Poodle Springs.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Kathy Reichs has written some great mysteries, where the primary character is Forensic Archaeologist, Kay Scarpetta.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "What is the name of Colin Creevys brother, who appears in the book Harry Potter and the Order of the Phoenix?",
            options: ["Dennis Creevy", "James Creevy", "Darian Creevy", "Carson Creevy"],
            correctAnswer: 0
        },
        {
            question: "Why was Hagrid missing in the beginning of Harry Potter and the Order of the Phoenix?",
            options: ["He went looking for Dumbleodre.", "He went looking for Sirius Black.", "He went hunting unicorns.", "He went hunting giants."],
            correctAnswer: 3
        },
        {
            question: "What did Hermione do to Ron before she stormed out of the charms classroom in Harry Potter and the Half-Blood Prince?",
            options: ["She charmed pencils to fly and poke Ron.", "She charmed a desk to fly over to Ron.", "She charmed little yellow birds to fly at Ron and peck him.", "She charmed a chair to fly across the room at Ron."],
            correctAnswer: 2
        },
        {
            question: "Draco Malfoy cries in a book of the Harry Potter series.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Did Crabbe and Goyle ever become friends with Harry, Ron and Hermione in the Harry Potter books?",
            options: ["No", "Yes"],
            correctAnswer: 0
        },
        {
            question: "Harry liked Cho in the book Harry Potter and the Half-Blood Prince.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "In Harry Potter and the Philosophers Stone, before Harry went to fight Professor Quirrel and He-Who-Must-Not-Be-Named, Hermione helped him with a task that involved what?",
            options: ["A set of potions sent from Professor Snape", "A chess set by Professor Flitwick", "A dragon sent from Hagrid", "An ancient textbook sent from Professor Binns"],
            correctAnswer: 0
        },
        {
            question: "What was the name of the handsome, selfish teacher in Harry Potter and the Chamber of Secrets?",
            options: ["Professor Gilderoy Lockhart", "Professor Godric Gryffindor", "Professor Severus Snape", "Professor Cedric Diggory"],
            correctAnswer: 0
        },
        {
            question: "In Harry Potter and the Philosophers Stone, what was the password to the Gryffindor tower during Halloween?",
            options: ["Fairy lights", "Pig snout", "None of these", "Zebras tail"],
            correctAnswer: 1
        },
        {
            question: "In Harry Potter and the Philosophers Stone, who gave Nearly-Headless Nick the rejection letter from the Headless Hunt?",
            options: ["Sir Sturgis Podmore", "Sir Patrick Delaney-Podmore", "Sir Bloody Baron", "Sir Delaney Patrick-Podmore"],
            correctAnswer: 1
        },
        {
            question: "In the Harry Potter series, who created the Ravenclaw House when Hogwarts was built?",
            options: ["Ronald Ravenclaw", "Rowena Ravenclaw", "Rowana Ravenclaw", "Ricky Ravenclaw"],
            correctAnswer: 1
        },
        {
            question: "What was the name of the child who delivered Ron his parcels in Harry Potter and the Goblet of Fire?",
            options: ["Dennis", "Creevy", "Nigel", "Collin"],
            correctAnswer: 2
        },
        {
            question: "Filch is a wizard in the Harry Potter books.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Who took over the Fat Ladys job after she was scared out of her portrait in Harry Potter and the Prisoner of Azkaban?",
            options: ["Sir Delaney Patrick-Podmore", "Trolls", "Sirius Black", "Sir Cadogan"],
            correctAnswer: 3
        },
        {
            question: "Who lost the list of passwords for the Gryffindor tower in Harry Potter and the Prisoner of Azkaban?",
            options: ["Neville Longbottom", "Padma Patil", "Ron Weasley", "Dean Thomas"],
            correctAnswer: 0
        },
        {
            question: "In Harry Potter and the Half-Blood Prince, who was bitten by the werewolf Fenfir Greyback?",
            options: ["Ron", "Percy", "Bill", "Charlie"],
            correctAnswer: 2
        },
        {
            question: "Who killed Dumbledore in Harry Potter and the Half-Blood Prince?",
            options: ["Professor Snape", "Bellatrix Lestrange", "Professor Binns", "Lucius Malfoy"],
            correctAnswer: 0
        },
        {
            question: "What is James Potter called by Lily Evans in Harry Potter and the Order of the Phoenix?",
            options: ["A selfish, bullying toerag", "An ignorant git", "A bullying, selfish git", "A big-headed git"],
            correctAnswer: 0
        }
    ],
    'television': [
        {
            question: "Urban Meyer left the head coach position at the Utah Utes to become head coach of this team.",
            options: ["University of Miami", "Bowling Green", "University of Florida", "Florida St."],
            correctAnswer: 2
        },
        {
            question: "Jack Bauer, Nina Myers and George Mason are three of the characters of this TV series.",
            options: ["20/20", "3 South", "24", "60 Minutes"],
            correctAnswer: 2
        },
        {
            question: "Harry Solomon, Dick Solomon and Dr. Mary Albright.",
            options: ["Battlestar Galactica", "The A-Team", "3rd Rock from the Sun", "7th Heaven"],
            correctAnswer: 2
        },
        {
            question: "The annoying neighbours, the Ochmoneks are from this TV show.",
            options: ["All My Children", "Beverly Hills 90210", "Dawsons Creek", "ALF"],
            correctAnswer: 3
        },
        {
            question: "One of these characters is not from Baywatch.",
            options: ["Jill Riley", "Craig Pomeroy", "Hobie Buchannon", "Kelly Taylor"],
            correctAnswer: 3
        },
        {
            question: "Gilbert (Gil) Arthur Grissom is the night shift team supervisor from this TV show.",
            options: ["The City", "CSI: Miami", "CSI: Crime Scene Investigation", "CSI: New York"],
            correctAnswer: 2
        },
        {
            question: "One of these ER characters is not a doctor.",
            options: ["Dave Malucci", "Ray Barnett", "Samantha Taggart", "Gregory Pratt"],
            correctAnswer: 2
        },
        {
            question: "This was one of the best known bosses of Fred Flintstone.",
            options: ["Mr. Slate", "Mr. Jones", "Mr. Smith", "Mr. Garret"],
            correctAnswer: 0
        },
        {
            question: "Julie Cooper and Summer Roberts are two characters from this TV series.",
            options: ["One Tree Hill", "The O.C.", "Dawsons Creek", "Beverly Hills 90210"],
            correctAnswer: 1
        },
        {
            question: "Charlotte York, Miranda Hobbes and Samantha Jones are female characters from this TV show.",
            options: ["Gilmore Girls", "Smallville", "Desperate Housewives", "Sex and the City"],
            correctAnswer: 3
        },
        {
            question: "Kelly and Bud are the kids of a family depicted in this TV series.",
            options: ["Happy Family", "Married... with Children", "The Partridge Family", "All in the Family"],
            correctAnswer: 1
        },
        {
            question: "What is the name of the episode of SpongeBob SquarePants in which Sponge and friends all had superpowers?",
            options: ["Mermaid Man and Barnicle Boy 3", "Mermaid Man and Barnicle Boy 2", "Bubblestand", "Fry Cook Games"],
            correctAnswer: 0
        },
        {
            question: "Where does SpongeBob SquarePants live in the self-titled series?",
            options: ["In an apple", "In a watermelon", "In a coconut", "In a pineapple"],
            correctAnswer: 3
        },
        {
            question: "Sandy Cheeks, the popular character from the animated series SpongeBob SquarePants, is from what state?",
            options: ["Florida", "Georgia", "Texas", "Alaska"],
            correctAnswer: 2
        },
        {
            question: "What is the secret ingredient of The Fake Krabby Patty, a sandwich mentioned in the series SpongeBob SquarePants?",
            options: ["Four heaping pounds of plankton", "Jellyfish jelly", "A cup of love", "Extra salt"],
            correctAnswer: 0
        },
        {
            question: "What was the name of the toy shell SpongeBob and Patrick had with them in the Kelp Woods?",
            options: ["Spiral", "Hermit Crab Shell Toy", "Magic conch shell", "Magic Clam shell"],
            correctAnswer: 2
        },
        {
            question: "Where does the cartoon character SpongeBob work?",
            options: ["Chum Bucket", "Beach Bums", "Tuff Tavern", "Krusty Krab"],
            correctAnswer: 3
        },
        {
            question: "Which character from the animated series SpongeBob SquarePants spoke the words from the sound clip?",
            options: ["Squidward Tentacles", "Gary", "Mr.Crabs", "Patrick Star"],
            correctAnswer: 0
        },
        {
            question: "Which SpongeBob SquarePants character spoke the following words?",
            options: ["Squidward Tentacles", "SpongeBob SquarePants", "Plankton", "Gary"],
            correctAnswer: 1
        },
        {
            question: "Rachel from Friends moves to live with the rest of the friends after escaping her marriage to this man.",
            options: ["Mark", "Barry", "Mike", "Frank"],
            correctAnswer: 1
        },
        {
            question: "Alf from the sitcom series has very few friends outside the Tanners. One of them is the boy that lives with Trevor and Raquel Ochmonek. This is their relation to him.",
            options: ["He is their grandchild.", "He is their nephew.", "He is their adopted son.", "He is their son."],
            correctAnswer: 1
        },
        {
            question: "Doctor Peter Benton was a fictional medical doctor on the television series ER from season one through season eight. What is characteristic of his son?",
            options: ["He is deaf.", "He is a girl.", "He is blind.", "He is mentally-challenged."],
            correctAnswer: 0
        },
        {
            question: "Jefferson DArcy is Marcys second husband in Married... with Children. She married him for money.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "The last episode of Everybody Loves Raymonds ninth season depicts a medical accident that affects this character.",
            options: ["Marie", "Debra", "Frank", "Raymond"],
            correctAnswer: 3
        },
        {
            question: "Rose (Kate Winslet) from Titanic (1997) is this old when the ship sinks.",
            options: ["17", "23", "14", "20"],
            correctAnswer: 0
        },
        {
            question: "Before Neo joins Morpheus and his group (The Matrix) he works as this.",
            options: ["Software programmer", "He is unemployed", "Scientist", "Internet broker"],
            correctAnswer: 0
        },
        {
            question: "Darth Sidious is portrayed in all of these Star Wars movies except this one.",
            options: ["Star Wars Episode III: Revenge of the Sith", "Star Wars Episode II: Attack of the Clones", "Star Wars Episode I: The Phantom Menace", "Star Wars Episode IV: A New Hope"],
            correctAnswer: 3
        },
        {
            question: "This fictional TV character was Mikes wife, and a mother to Greg, Marcia, Peter, Jan, Bobby and Cindy.",
            options: ["Mary Hartman", "Carol Brady", "Marian Cunningham", "Shirley Partridge"],
            correctAnswer: 1
        },
        {
            question: "This TV mom, who had a daughter named Gloria, was married to the working class bigot Archie.",
            options: ["Carol Brady", "Edith Bunker", "Marcia Brady", "Louise Jefferson"],
            correctAnswer: 1
        },
        {
            question: "This TV character and her husband Barney had an extremely strong son named Bamm Bamm.",
            options: ["Wilma Flintstone", "Morticia Addams", "Carly Simon", "Betty Rubble"],
            correctAnswer: 3
        },
        {
            question: "This TV moms son, Little Ricky, learned to sing Babalou like his dad, Ricky.",
            options: ["Ethel Mertz", "Lucy Ricardo", "Marian Cunningham", "Mortica Addams"],
            correctAnswer: 1
        },
        {
            question: "This TV mom was married to Herman, who caused more trouble than her son Eddie.",
            options: ["Carol Partridge", "Olivia Newton John", "Mortica Addams", "Lily Munster"],
            correctAnswer: 3
        },
        {
            question: "Which widowed TV mother travelled around in a colorful bus with her children Keith, Laurie, Danny, Christopher and Tracy?",
            options: ["Mortica Addams", "Shirley Partridge", "Carol Brady", "Marian Cunningham"],
            correctAnswer: 1
        },
        {
            question: "This TV personality and her husband Ward were the loving parents of Wally and the Beaver.",
            options: ["June Cleaver", "Marian Cunningham", "Lily Munster", "Edith Bunker"],
            correctAnswer: 0
        },
        {
            question: "This TV mom and her husband Charles were busy raising Mary, Laura and Carrie in Walnut Grove, Minnesota.",
            options: ["Marian Cunningham", "Mortica Addams", "Caroline Ingalls", "June Cleaver"],
            correctAnswer: 2
        },
        {
            question: "Which TV mom moved to Manhattans Upper East Side with her son Lionel and her husband George?",
            options: ["Carol Brady", "Anne Jones", "Louise Jefferson", "Edith Bunker"],
            correctAnswer: 2
        },
        {
            question: "Pugsley and Wednesday were the kids of this TV mom and her husband, Gomez.",
            options: ["Edith Bunker", "Morticia Addams", "Betty Rubble", "June Cleaver"],
            correctAnswer: 1
        },
        {
            question: "This red-haired TV character was the wife of Fred and the mother of Pebbles.",
            options: ["June Cleaver", "Betty Rubble", "Carrie Fisher", "Wilma Flintstone"],
            correctAnswer: 3
        },
        {
            question: "This TV mother divorced her husband and moved back to her hometown of Indianapolis with her two daughters, Julie and Barbara.",
            options: ["Carrie Fisher", "June Cleaver", "Carol Partridge", "Ann Romano Royer"],
            correctAnswer: 3
        },
        {
            question: "This TV mom and her husband Howard were the parents of Chuck, Richie and Joanie.",
            options: ["Edith Bunker", "Shirley Partridge", "Carol Brady", "Marion Cunningham"],
            correctAnswer: 3
        },
        {
            question: "In The Pilot who is dressed as a bride and becomes a room mate to Monica?",
            options: ["Rachel", "Phoebe", "Janice", "Chandler"],
            correctAnswer: 0
        },
        {
            question: "What was the nickname that never caught on for Ross?",
            options: ["The divorcer", "Fossil dude", "Rossatron", "Rossasaurous"],
            correctAnswer: 2
        },
        {
            question: "In the episode where everyone is up all night in season 7, why cant Phoebe go to sleep?",
            options: ["She is drunk in Vegas", "She is going into labor", "She has to much coffee", "The smoke detector keeps beeping"],
            correctAnswer: 3
        },
        {
            question: "Who broke Chandlers barcalounger?",
            options: ["Joey", "Chandler himself", "Monica", "Rachel"],
            correctAnswer: 0
        },
        {
            question: "What is Rachels full name?",
            options: ["Rachel Emma Green", "Rachel Lisa Green", "Rachel Karen Green", "Rachel Isabella Green"],
            correctAnswer: 2
        },
        {
            question: "What friend never had a bike as a child?",
            options: ["Joey", "Chandler", "Phoebe", "Monica"],
            correctAnswer: 2
        },
        {
            question: "In the opening credits/theme song, what is the color of Joeys umbrella?",
            options: ["Blue", "Red", "Green", "Black"],
            correctAnswer: 0
        },
        {
            question: "What was Rosss son, Bens first word?",
            options: ["Ma-ma", "How you doin?", "Hi", "Dog"],
            correctAnswer: 2
        },
        {
            question: "How many chairs are around Monicas kitchen table?",
            options: ["Five", "Six", "Four", "Three"],
            correctAnswer: 2
        },
        {
            question: "What number wife is Rachel to Ross?",
            options: ["They never got married", "Third", "Second", "First"],
            correctAnswer: 1
        }
    ],
    'religion-faith': [
        {
            question: "What Hollywood actor portrayed Casanova in the 2005 movie entitled Casanova, based on the life of the popular adventurer?",
            options: ["Antonio Banderas", "Ryan Phillippe", "Heath Ledger", "Johnny Depp"],
            correctAnswer: 2
        },
        {
            question: "Which of these is NOT a son of Adam and Eve?",
            options: ["Abel", "Cain", "Seth", "Enoch"],
            correctAnswer: 3
        },
        {
            question: "Noah sent these two birds out of the ark to search for land:",
            options: ["raven and dove", "raven and hawk", "dove and hawk", "hawk and jay"],
            correctAnswer: 0
        },
        {
            question: "Jacob had 12 sons.  Which of his wives/maids bore the most babies?",
            options: ["Rachel", "Leah", "Zilpah", "Bilhah"],
            correctAnswer: 1
        },
        {
            question: "Which of these animals did the Israelites worship while Moses was on the mountain?",
            options: ["duck", "calf", "bull", "ram"],
            correctAnswer: 1
        },
        {
            question: "Many of King Solomons wise sayings are recorded in Book 10 of Proverbs.  Which of these is NOT found there?",
            options: ["You will say the wrong thing if you talk too much--so be sensible and watch what you say.", "Children with good sense make their parents happy, but foolish children make them sad.", "When you see trouble coming, dont be stupid and walk right into it--be smart and hide.", "Good people are remembered long after they are gone, but the wicked are soon forgotten."],
            correctAnswer: 2
        },
        {
            question: "Mary was visited by this angel.",
            options: ["Michael", "Gabriel", "Uriel", "Raphael"],
            correctAnswer: 1
        },
        {
            question: "Jesus was fond of using parables to give his messages.  Which of these was NOT one he used?",
            options: ["The Parable of the Ten Servants", "The Parable of the Old Men and the Young", "The Parable of the Mustard Seed", "The Parable of the Prodigal Son"],
            correctAnswer: 1
        },
        {
            question: "Which of the Horsemen of the Apocalypse is the first to be called out?",
            options: ["Red Horse (War)", "Black Horse (Famine)", "White Horse (Conquest )", "Pale/Green Horse (Death)"],
            correctAnswer: 2
        },
        {
            question: "Complete the following quote from Matthew 5:3: Blessed are the poor in spirit, for ________",
            options: ["shall be called children of God.", "they shall be comforted.", "theirs is the Kindgom of Heaven.", "they shall see Heaven."],
            correctAnswer: 2
        },
        {
            question: "Who wrote the first five books of the Bible?",
            options: ["Moses", "Abraham", "Adam", "Joseph"],
            correctAnswer: 0
        },
        {
            question: "In the Bible, how many wives and concubines did Solomon have?",
            options: ["2000", "500", "100", "1000"],
            correctAnswer: 3
        },
        {
            question: "Who wrote most of the books in the New Testament?",
            options: ["David", "Paul", "Peter", "John"],
            correctAnswer: 1
        },
        {
            question: "Who wrote the Book of Revelation while in exile?",
            options: ["Peter", "Paul", "John", "James"],
            correctAnswer: 2
        },
        {
            question: "According to the accepted theory, how old was Jesus when He was crucified?",
            options: ["33", "30", "27", "40"],
            correctAnswer: 0
        },
        {
            question: "How old was Jesus when He performed His first miracle (Biblical, not Apocriphal)?",
            options: ["40", "33", "30", "27"],
            correctAnswer: 2
        },
        {
            question: "David, the famous ancient King of Israel, was the oldest child in the family.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "It is stated in the Bible that God told Moses to build the Temple in Jerusalem.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "According to the New Testament, who obtained permission to take Jesus Christs body down from the cross and place it in the tomb?",
            options: ["Joseph of Arimathea", "Mary Magdalene", "Apostle Peter", "Joseph of Antioch"],
            correctAnswer: 0
        },
        {
            question: "Apostle Paul was a kind, friendly and peace-loving man who always helped Christians even before his conversion to Christianity.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Seven people went on the ark with Noah according to the Bible, Genesis, chapters 6 to 9.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "What was the profession of Luke the Apostle according to the New Testament?",
            options: ["Carpenter", "Boat builder", "Tax collector", "Physician"],
            correctAnswer: 3
        },
        {
            question: "Who committed the first murder in the Bible?",
            options: ["Abel", "Cain", "Adam", "Solomon"],
            correctAnswer: 1
        },
        {
            question: "Who was Gods son according to the Bible?",
            options: ["Peter", "Jesus", "John", "Solomon"],
            correctAnswer: 1
        },
        {
            question: "What is the name of the angel that God sent to tell Mary she was to conceive Jesus?",
            options: ["Michael", "Abraham", "Peter", "Gabriel"],
            correctAnswer: 3
        },
        {
            question: "Who was Jesus earthly father according to the Bible?",
            options: ["Solomon", "Joseph", "David", "no one"],
            correctAnswer: 1
        },
        {
            question: "Which of the following is not generally considered one of the seven deadly sins?",
            options: ["hatred", "envy", "lust", "obfuscation"],
            correctAnswer: 3
        },
        {
            question: "According to Matthew and Luke, in what city was Jesus born?",
            options: ["Bethlehem", "Babylon", "Nazareth", "Jerusalem"],
            correctAnswer: 0
        },
        {
            question: "Can a deacon get married?",
            options: ["Yes", "No"],
            correctAnswer: 0
        },
        {
            question: "You drink the coffee and turn the cup upside down.  The reader predicts the future, deciphering various patterns formed inside the cup.",
            options: ["Tasseomancy", "I Ching", "Scrying", "Hakata"],
            correctAnswer: 0
        },
        {
            question: "This is a deck of 78 cards with pictures and inscriptions on them. They are divided into several suits and the person extracts cards that the reader interprets.",
            options: ["Belote", "Cartopedy", "Tarot", "Cledonism"],
            correctAnswer: 2
        },
        {
            question: "This method of divination uses air and water. The person covers their head with a cloth, fill a vase with water and expose it to the air.  They whisper a wish over the vase. If bubbles show on the water surface, this is considered a positive sign and the wish will probably come true.",
            options: ["Critomancy", "Water scrying", "Eromancy", "Dowsing"],
            correctAnswer: 2
        },
        {
            question: "This method includes hexagrams which consist of six lines either solid or broken. Solid lines are considered strong and active, and broken lines stand for weak and acquiescent. These lines define the meaning of the hexagrams. Each hexagram has a different meaning. You determine your own hexagram by tossing 3 coins 3 times.",
            options: ["Astrology", "Aura information", "I Ching", "Tarot"],
            correctAnswer: 2
        },
        {
            question: "This method of divination uses a set of 24 alphabet letters that are usually carved on small tiles, so that the person could extract one of all 24 and to interpret its meaning. They were also carved and drawn building walls for protection.",
            options: ["Shell scrying", "Tarot", "Palm reading", "Runes"],
            correctAnswer: 3
        },
        {
            question: "This is the careful screening of your palm, its shapes and lines in order to guess some events from the past and see events in the future.",
            options: ["Tasseomancy", "Cartopedy", "Cledonism", "Palmistry"],
            correctAnswer: 3
        },
        {
            question: "This method uses climate conditions to predict the future. It was considered that climate is the attitude of gods towards men, and that each atmospheric event had its own meaning.",
            options: ["Graphology", "Cephalomancy", "Bibliomancy", "Aeromancy"],
            correctAnswer: 3
        },
        {
            question: "This method uses books for predicting ones future. The person should take a book, open to a random page and read a passage. Then he should interpret it.",
            options: ["Bibliomancy", "Geomancy", "Hydromancy", "Chiromancy"],
            correctAnswer: 0
        },
        {
            question: "This way of divination uses onion sprouts. First a ritual is held in order to state what the divination is about. Then the onion sprouts are put on an altar. It is thought that onion sprouts can tell you about friends and relatives who are far away, give love advice and answer yes or no questions about the future.",
            options: ["Cyclomancy", "Cromniomancy", "Crystallomancy", "Chirognomy"],
            correctAnswer: 1
        },
        {
            question: "This method uses birds to predict the future. The divinator scatters grains and then he carefully observes the way the birds peck at the grain.",
            options: ["Botanomancy", "Austromancy", "Captopromancy", "Alectryomancy"],
            correctAnswer: 3
        },
        {
            question: "In ancient times people thought that illnesses were caused by demons, possessing the soul of a person. So they cured those illnesses with exorcism. Exorcism is derived from the Greek word  exorkizein. What does this word mean?",
            options: ["To kill the soul", "To expel the demon", "To bind by oath", "To kill the ghost"],
            correctAnswer: 2
        },
        {
            question: "Ancient Babylonian priests were one of the first exorcists. They meant to destroy the evil spirit, possessing the victim, by performing this ritual.",
            options: ["They drew mighty symbols on the forehead of the victim.", "They destroyed a wax or clay image of a demon.", "They drilled a hole in the skull of the possessed.", "They killed the possessed person by stabbing them with a sacrificial knife."],
            correctAnswer: 1
        },
        {
            question: "Exorcism is not popular among religions nowadays.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Jesus Christ is considered to be an exorcist. One of the legends tells of Jesus casting out multiple demons from a madman. The spirits then entered the bodies of some animals. What kind of animals were they?",
            options: ["Vultures", "Cows", "Crows", "Pigs"],
            correctAnswer: 3
        },
        {
            question: "Jesus Christ gave the power to exorcise demons to his disciples.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "In Judaism the evil spirit that possesses the soul of its victim is called dybbuk. It is exorcised through this part of the body.",
            options: ["Mouth", "Small toe", "Left Arm", "Chest"],
            correctAnswer: 1
        },
        {
            question: "The exorcist must feel as free of sin as possible. Why?",
            options: ["So the exorcist does not die", "So the exorcist can easily absorb the demons", "So the possessed victim does not die", "So demons cannot easily possess the exorcist"],
            correctAnswer: 3
        },
        {
            question: "Exorcism is related to ASC. What does ASC stand for?",
            options: ["Affecting Spirit of Cataclysm", "Altered State Of Consciousness", "Affected Soul by Craziness", "Affected Soul by Cabala"],
            correctAnswer: 1
        },
        {
            question: "During Christian exorcism, the victim is to hold a crucifix and the exorcist is encouraged to use holy water and relics. These  two other objects should also be present.",
            options: ["Skull and Bones", "Sword and Shield", "Salt and Wine", "Feather and Ink-pot"],
            correctAnswer: 2
        },
        {
            question: "Although all exorcisms proceed differently, some stages are common. There are five common stages - The Presence, Break-point, The Voice, The Clash and this.",
            options: ["Redemption", "Deportation", "Expulsion", "Expatriation"],
            correctAnswer: 2
        },
        {
            question: "Adam was the first human made by God according to the Bible texts.",
            options: ["True", "False"],
            correctAnswer: 0
        }
    ],
    'humanities': [
        {
            question: "Which vegetables are considered taboo food in Buddhist tradition?",
            options: ["All legumes", "Eggplants and tomatoes", "Garlic and onion", "Cabbage and lettuce"],
            correctAnswer: 2
        },
        {
            question: "Is this the correct usage of the word inferring?",
            options: ["Yes", "No", "y saying that I look good today, are you inferring that I did not look good yesterday?"],
            correctAnswer: 1
        },
        {
            question: "Is this the correct usage of the word continually?",
            options: ["Yes", "No"],
            correctAnswer: 1
        },
        {
            question: "Which of these sentences is correct?",
            options: ["If you build it, thence he will come.", "Whence did he come?", "From hence to eternity, I will search.", "From whence did he come?"],
            correctAnswer: 1
        },
        {
            question: "Which of these is correct?",
            options: ["The capital building is located in the capitol.", "The capitol building is located in the capitol.", "The capitol building is located in the capital.", "The capital building is located in the capital."],
            correctAnswer: 2
        },
        {
            question: "In the following sentence, which word is incorrect?",
            options: ["principal", "unprincipled", "principle", "None of the words is incorrect; the sentence is correct as is."],
            correctAnswer: 3
        },
        {
            question: "Which of the following is NOT a synonym of the word reticent?",
            options: ["Silent", "Reluctant", "These are all synonyms of the word reticent.", "Restrained"],
            correctAnswer: 2
        },
        {
            question: "Which of the following is incorrect?",
            options: ["Thirty people comprised the class.", "These are all correct usages of the word comprised.", "The class was comprised of 30 people.", "The class comprised 30 people."],
            correctAnswer: 1
        },
        {
            question: "Which of these is incorrect?",
            options: ["He awakened at six.", "He awoke at six.", "All of these sentences are correct.", "He woke up at six."],
            correctAnswer: 2
        },
        {
            question: "Which of these sentences means I love you in Spanish?",
            options: ["Ti amo.", "Mi amas vin.", "Kocham cie.", "Te amo."],
            correctAnswer: 3
        },
        {
            question: "Rakastan sinua is one of the ways to say I love you in which European language?",
            options: ["French", "Finnish", "German", "Bulgarian"],
            correctAnswer: 1
        },
        {
            question: "Which expression would you use to say I love you in Danish?",
            options: ["Je taime.", "I love thee.", "Volim te.", "Jeg elsker dig."],
            correctAnswer: 3
        },
        {
            question: "In what European language does Je taime mean I love you?",
            options: ["Italian", "German", "French", "Swedish"],
            correctAnswer: 2
        },
        {
            question: "Which of the following sentences means I love you in German?",
            options: ["Ich liebe Dich.", "Je taime.", "Volim te.", "Te amo."],
            correctAnswer: 0
        },
        {
            question: "Volim te means I love you in three of these European languages. Which is the odd one?",
            options: ["Italian", "Bosnian", "Croatian", "Serbian"],
            correctAnswer: 0
        },
        {
            question: "What is the Swahili expression for I love you?",
            options: ["Je taime", "Nakupenda", "Ti amo", "Te quiero"],
            correctAnswer: 1
        },
        {
            question: "In which Turkic language does Seni seviyorum mean I love you?",
            options: ["Turkish", "Navajo", "Hebrew", "Icelandic"],
            correctAnswer: 0
        },
        {
            question: "Name this artificially-constructed international language, in which Mi amas vin means I love you.",
            options: ["Thai", "Spanish", "Esperanto", "Navajo"],
            correctAnswer: 2
        },
        {
            question: "Which of these sentences means I love you in Dutch?",
            options: ["Ti amo.", "Ne mohotatse.", "Ich liebe Dich.", "Ik hou van jou."],
            correctAnswer: 3
        },
        {
            question: "The implement, used to extinguish the flame of a candle, is called this.",
            options: ["Candleholder", "Candleberry", "Candlesnuffer", "Candlestick"],
            correctAnswer: 2
        },
        {
            question: "When something contains or yields an acid, it is this.",
            options: ["Acidifiable", "Acidiferous", "Acidimetric", "Acidophilous"],
            correctAnswer: 1
        },
        {
            question: "The monitoring, recording, and measuring of a living organisms basic physiological functions is known as this.",
            options: ["Biotelemetry", "Biosystematy", "Bipartisanism", "Biomedicine"],
            correctAnswer: 0
        },
        {
            question: "Enterokinase is this.",
            options: ["Hormone", "Enzyme", "Medical condition", "Disease"],
            correctAnswer: 1
        },
        {
            question: "Copious perspiration is known as this.",
            options: ["Diabolisation", "Detumescence", "Deuterogamy", "Diaphoresis"],
            correctAnswer: 3
        },
        {
            question: "Gerontology is the branch of medical science that deals with diseases and problems specific to these people.",
            options: ["Elderly", "Children", "Adults", "Blind people"],
            correctAnswer: 0
        },
        {
            question: "One of these terms means preserving the mutual relations of parts, especially as to size and form; maintaining relative proportion.",
            options: ["Homolographic", "Homomorphic", "Homologisation", "Homomorphism"],
            correctAnswer: 0
        },
        {
            question: "Hyperplasia is the abnormal increase in the number of these.",
            options: ["Habitat", "Species", "Teeth", "Cells"],
            correctAnswer: 3
        },
        {
            question: "The authority to teach religious doctrine is referred to as this.",
            options: ["Magistrature", "Magistrateship", "Magisterium", "Mastigophoran"],
            correctAnswer: 2
        },
        {
            question: "The word vampire is a very controversial one, when it comes to its etymology. There are many theories about its origin and meaning. According to one of these theories, vampire comes from the Magyar words vam, meaning blood, and pir. What does pir mean in Magyar?",
            options: ["Monster", "Animal", "Blood", "Human"],
            correctAnswer: 0
        },
        {
            question: "One of the most famous vampires is Dracula (some believe that he was the first vampire). In Romanian Dracul means either Dragon or Devil and therefore Dracula is translated as Son of the Dragon or Son of the Devil. Due to his favorite sadistic punishment, Vlad Dracula was nicknamed Tepes.  He preferred to kill those who opposed him in this manner.",
            options: ["Disembowelment", "Hanging", "Beheading", "Impalement"],
            correctAnswer: 3
        },
        {
            question: "Vlad Tepes was one of the major allies of the Ottoman Empire, therefore Romania was never put under Ottoman rule.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Of course everybody knows about the Blood Vampires. They feed on the blood of their victims and prefer sucking it from the neck, the wrist or the groin. But there is another, less known, kind of vampires.  What do they feed on?",
            options: ["Aura", "Flesh", "Brains", "Vegetables"],
            correctAnswer: 0
        },
        {
            question: "Vampires are common to the folklore of many countries. The Civatateo is an Aztec vampire, created when a noblewoman died at childbirth. In aboriginal mythology, vampires had suckers on their fingers. What are the Yakshis (sort of Indian vampires) like?",
            options: ["Beautiful women", "Wounded Wolves", "Ugly Men", "Innocent Children"],
            correctAnswer: 0
        },
        {
            question: "It is believed that you can stop a vampire, by throwing rice or marbles on the floor.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "One of the most popular ways of killing a vampire (apart from the trivial sharp wooden stick in the heart), is to expose the creature to sunlight. However, there is a disease, that has similar symptoms. People who suffer from it are very sensitive to sunlight and avoid going out during the day. What is this horrible disease?",
            options: ["Porphyria", "Scrapie", "Influenza", "Anemia"],
            correctAnswer: 0
        },
        {
            question: "This woman was believed to be a vampire. She was obsessed with her beauty and youth, and slaughtered as many as six hundred innocent women in an attempt to maintain her vitality. Although her guilt has never been proven, she is still one of the most famous serial killers in Hungarian and Slovak history.",
            options: ["Katarina Szentes", "Ilona Ujvary", "Elizabeth Bathory", "Janos Benicka"],
            correctAnswer: 2
        },
        {
            question: "Silver doesnt harm vampires.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Peter Kurten was called a vampire, because he consumed the blood of some of his victims. He was accused of nine murders and seven attempted murders and was sentenced to death. He was guillotined on 2 June 1932. What was his nationality?",
            options: ["German", "Russian", "Romanian", "Briton"],
            correctAnswer: 0
        },
        {
            question: "The great circle on the celestial sphere, midway between the celestial poles is called this.",
            options: ["Equinoctial", "Equilibria", "Equilibration", "Equinity"],
            correctAnswer: 0
        },
        {
            question: "If I am famous for my steadiness of mind under stress, then I am famous for this.",
            options: ["Equanimity", "Equalization", "Equalitarianism", "Equid"],
            correctAnswer: 0
        },
        {
            question: "If a statement is ambiguous, it is said to be this.",
            options: ["Equivocal", "Equestrian", "Equipoised", "Equilateral"],
            correctAnswer: 0
        },
        {
            question: "One of the four pairs of words below contains two synonyms.",
            options: ["Equipollent - Equipped", "Equipage - Equipoise", "Equal - Equivalent", "Equipotential - Equilateral"],
            correctAnswer: 2
        },
        {
            question: "Do the words equivoke and equivoque mean the same?",
            options: ["Yes", "No"],
            correctAnswer: 0
        },
        {
            question: "Gilgamesh is a character from the Sumerian mythology.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Athena was the Greek equivalent of the goddess Minerva.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Nike was a goddess, who personified triumph and victory (Greek mythology). Ironically, she was paralyzed and could not move her legs.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Helicon is the name of an ancient lake, where the Muses were born.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Calliope was the muse for music.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Marduk was a Mesopotamian deity.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Svarog is the highest god of the pantheon (Slavic mythology) and the god of thunder and lightning.",
            options: ["True", "False"],
            correctAnswer: 1
        }
    ],
    'general': [
        {
            question: "This drink contains caffeine.",
            options: ["Coffee", "Orange juice", "Mineral water", "Beer"],
            correctAnswer: 0
        },
        {
            question: "If a TV program is rated G then this is true.",
            options: ["It contains moderate violence.", "It is suitable for young children.", "It contains mild sexual situations.", "It is suitable for all audiences."],
            correctAnswer: 3
        },
        {
            question: "The theory of relativity was introduced in physics by this man.",
            options: ["Archimedes", "Galileo Galilei", "Isaac Newton", "Albert Einstein"],
            correctAnswer: 3
        },
        {
            question: "The symbol for the chemical element iron is this.",
            options: ["I", "Zn", "Fe", "Br"],
            correctAnswer: 2
        },
        {
            question: "The author of the novel A Portrait of the Artist as a Young Man is this writer.",
            options: ["Samuel Beckett", "William Faulkner", "James Joyce", "T. S. Eliot"],
            correctAnswer: 2
        },
        {
            question: "The capital of Mongolia is this city.",
            options: ["Quezon", "Islamabad", "Davao", "Ulaanbaatar"],
            correctAnswer: 3
        },
        {
            question: "Mitochondrias function in cells is to perform this.",
            options: ["To store information needed for cellular division", "To process proteins targeted to the plasma membrane", "To control chemical reactions within the cytoplasm", "To convert organic materials into energy"],
            correctAnswer: 3
        },
        {
            question: "The US bought Alaska in this year.",
            options: ["1882", "1867", "1942", "1854"],
            correctAnswer: 1
        },
        {
            question: "The 23rd US President was in office during this period.",
            options: ["1889 - 1893", "1909 - 1913", "1877 - 1881", "1837 - 1841"],
            correctAnswer: 0
        },
        {
            question: "One of these actors did not star in the 1971 movie A Clockwork Orange.",
            options: ["Patrick Magee", "Malcolm McDowell", "Warren Brown", "Michael Bates"],
            correctAnswer: 2
        },
        {
            question: "The first Bulgarian state was formed in this year.",
            options: ["681 AD", "712 AD", "429 AD", "651 AD"],
            correctAnswer: 0
        },
        {
            question: "The 1962 Soccer World Cup tournament was held in this country.",
            options: ["Mexico", "Switzerland", "Chile", "Italy"],
            correctAnswer: 2
        },
        {
            question: "The Meryas were a probably Finno-Ugric tribe who lived in the region of modern Russia. This is the first historian to mention them.",
            options: ["Jordanes", "Eusebius of Caesarea", "Sima Guang", "Priscus"],
            correctAnswer: 0
        },
        {
            question: "The word abacus derives from a Hebrew word, meaning this.",
            options: ["Wood", "Movement", "Sky", "Dust"],
            correctAnswer: 3
        },
        {
            question: "The Chevy Nova sold poorly in Mexico because no va means doesnt go in Spanish.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "A car that gets over 200 miles per gallon is reclaimed by the factory, after its owner calls to congratulate the manufacturers about its excellent performance.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "A very complicated Honda Accord commercial required 606 takes and was done without the use of any computer-generated images.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Putting sugar in the gas tank of a carburetor-equipped vehicle will ruin the engine.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Man bought an old motorcycle only to discover that it was once owned by Elvis Presley.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Cars were stolen by thieves who wrote down VINs (car serial numbers)  and used them to obtain duplicate keys through auto dealerships.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "After an earthquake in  1989, a car thief was found crushed under a collapsed freeway overpass in the vehicle hed stolen.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "An artist painted a 60 ft. tall image of a naked woman above a tunnel in Malibu Canyon in 1966.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Police officers who use slimjims to assist locked out motorists have been killed by airbags.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "A speeder caught by photo radar, sends the police a photograph of money to pay his fine.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Sean Connery, George Lazenby, Roger Moore, Timothy Dalton and Pierce Brosnan have all played the role of a fictional British spy. Who was that character?",
            options: ["Johnny English", "James Bond", "Jim Malone", "Eliot Ness"],
            correctAnswer: 1
        },
        {
            question: "Man On The Moon, Amadeus and One Flew Over the Cuckoos Nest are all movies directed by him.",
            options: ["Pedro AlmodÃ³var", "MiloÅ¡ Forman", "Stanley Kubrick", "Martin Scorsese"],
            correctAnswer: 1
        },
        {
            question: "Across the Hall, Friends Like Us, Insomnia Café and Six of One are all working titles of one of famous US TV-series.  Name the series.",
            options: ["One Tree Hill", "ALF", "Friends", "Sex and the City"],
            correctAnswer: 2
        },
        {
            question: "The common link between these four movies -Chicken Run, Harry Potter, The Mummy Returns and Cast Away, is that...?",
            options: ["They all treat one and the same social problem.", "They all refer to one and the same social class.", "One and the same actor is starring in all of them.", "They all are produced by one and the same company."],
            correctAnswer: 3
        },
        {
            question: "Three of the following movies are produced by 20th Century Fox. Which is the odd one?",
            options: ["Cast Away", "House of Wax", "Dr. Dolittle 2", "Me, Myself  Irene"],
            correctAnswer: 1
        },
        {
            question: "David Suchet and Peter Ustinov are two actors who have played the role of the famous detective Sherlock Holmes.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Tom Cruise had a lead role in all, but one of these movies.  Which one?",
            options: ["Rain Man", "The Firm", "Endless Love", "Magnolia"],
            correctAnswer: 2
        },
        {
            question: "All but one of these statements represents a common bond between the movies, The Terminal and Catch Me if You Can.",
            options: ["Leonardo DiCaprio stars in them both.", "They both can be classified as dramas.", "Tom Hanks stars in them both.", "They both are produced by Spielberg."],
            correctAnswer: 0
        },
        {
            question: "Brad Pitt starred in all these movies, except one. Can you spot it?",
            options: ["The Beach", "Oceans Eleven", "Meet Joe Black", "Mr.  Mrs. Smith"],
            correctAnswer: 0
        },
        {
            question: "Robin Williams starred in Mrs. Doubtfire. Another great actor, Dustin Hoffman starred in Tootsie. Both characters pretended to be this.",
            options: ["Dead", "Women", "Bed-ridden and sick", "Insane"],
            correctAnswer: 1
        },
        {
            question: "A ghost is a supernatural entity thought to be the spirit of a person remaining on Earth after their death to seek revenge.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "There is something specific about Anne Boleyns ghost. What is it?",
            options: ["She does not have a ghost.", "Her ghost is without a head.", "Her ghost is without hands.", "Her ghost is male."],
            correctAnswer: 1
        },
        {
            question: "Which of the following statements about ghosts is incorrect?",
            options: ["Ghosts do not have a gross physical body.", "They are always depicted of a human size and shape.", "Sometimes they might manifest their presence by moving other objects or producing noises.", "They are usually portrayed as silvery, shadowy and fog-like."],
            correctAnswer: 1
        },
        {
            question: "The ghost of the Roman Emperor Caligula was said to haunt this place.",
            options: ["Amphitheatrum Castrense", "Basilica di San Giovanni in Laterano", "The Lamian Gardens of Rome", "Great Synagogue of Rome"],
            correctAnswer: 2
        },
        {
            question: "Ghosts have taken a significant place in literature and art since this period.",
            options: ["Romanticism", "Middle Ages", "Renaissance", "Baroque"],
            correctAnswer: 2
        },
        {
            question: "What does Suetonius, Geoffrey of Monmouth and Herodotus have in common?",
            options: ["They are three ghosts from the first urban legends.", "They are three writers that produce modern urban legends.", "They are three writers that produced the first urban legends.", "They are three ghost from the modern urban legends."],
            correctAnswer: 2
        },
        {
            question: "Is there a difference between a poltergeist and a ghost?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "The Epic of Gilgamesh is the oldest written story, containing a lot of references to the spirits of the dead.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "In 1993 an interesting study about Friday the 13th was published in the British Medical Journal. Its authors investigated if this mystical date is really dangerous. They compared the ratio of traffic volume to the number of vehicular accidents on two different days throughout several years. What was the conclusion of the study?",
            options: ["The number of vehicular accidents is lower on Friday the 13th", "Friday the 13th actually affects the number of vehicular accidents", "The results were inconclusive", "Friday the 13th doesnt have any affect on the number of vehicular accidents"],
            correctAnswer: 1
        },
        {
            question: "The fear of the fatal date is called this.",
            options: ["Aphenphosmphobia", "Chronomentrophobia", "Coitophobia", "Paraskevidekatriaphobia"],
            correctAnswer: 3
        },
        {
            question: "Chinese people believe that 13 is a lucky number.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "There are countless theories about the origins of fear of number 13. One says that the phobia comes from Norse mythology. According to a legend, the 13th god, the god of mischief, turned up at a gathering of the 12 Viking gods and caused the death of Balder the Good.  What was the god of mischief called?",
            options: ["Odin", "Tor", "Loki", "Hod"],
            correctAnswer: 2
        },
        {
            question: "People fear Friday for many reasons. For example, Jesus Christ was crucified on Friday, the Great Flood began on Friday and Adam and Eve were banned from the Garden of Eden on Friday. Do you know what type of day Friday was in the pagan Roman empire?",
            options: ["Parade day", "Execution day", "Tax day", "Day for prayers"],
            correctAnswer: 1
        },
        {
            question: "Most estate agents find it difficult to sell a house, numbered thirteen.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "The bad name of both Friday and number 13 can be explained by many historical and religious facts. However, the reason why they are linked together to form this powerful superstition, cant be explained so easily. According to one theory, the ill-fame of Friday 13th dates back to 13 October 1307, when King Philip IV of France arrested most of the knights of one famous Order. What was the name of the Order?",
            options: ["The Knights Templar", "The Ancient and Illustrious Order Knights of Malta", "Ancient Order Knights of the Mystic Chain", "Teutonic Order"],
            correctAnswer: 0
        },
        {
            question: "Female drivers have more traffic accidents on Friday the 13th.",
            options: ["False", "True"],
            correctAnswer: 0
        }
    ],
    'celebrities': [
        {
            question: "One of Johnny Depps earliest film roles was as Gator Lerner in what 1986 movie?",
            options: ["Top Gun", "Platoon", "The Color of Money", "Aliens"],
            correctAnswer: 1
        },
        {
            question: "Which of these Tim Burton films, starring Johnny Depp, came first?",
            options: ["Edward Scissorhands", "Sleepy Hollow", "Charlie and the Chocolate Factory", "Ed Wood"],
            correctAnswer: 0
        },
        {
            question: "This Scottish author, portrayed by Johnny Depp in the movie Finding Neverland, created the fictional character Peter Pan.",
            options: ["Joseph Grimm", "John Dunne", "George Eliot", "James Barrie"],
            correctAnswer: 3
        },
        {
            question: "In the 2001 movie Blow, Johny Depps role is based on the real life story of his character.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "What is the first name of Johnny Depps character in the 2004 film Secret Window?",
            options: ["Tom", "Mort", "Lou", "Alan"],
            correctAnswer: 1
        },
        {
            question: "Johnny Depp played the role of Inspector Fred Abberline in what 2001 film?",
            options: ["Chocolat", "From Hell", "The Astronauts Wife", "Nick of Time"],
            correctAnswer: 1
        },
        {
            question: "Johnny Depp publicly stated that he, in part, had based his portrayal of Captain Jack Sparrow in Pirates of the Caribbean: The Curse of the Black Pearl on which musician?",
            options: ["Keith Richards", "Mick Jagger", "Jim Morrison", "Ozzy Osbourne"],
            correctAnswer: 0
        },
        {
            question: "In the 1993 movie Whats Eating Gilbert Grape, Gilbert Grape is the name of the character played by Johnny Depp.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "When was Elvis born?",
            options: ["January 8, 1935", "August 8, 1977", "August 16, 1935", "January 8, 1977"],
            correctAnswer: 0
        },
        {
            question: "Who were Elviss parents?",
            options: ["Billy and Joseph", "Lisa Marie and Vernon", "Gladys and Vernon", "Priscilla and Dee"],
            correctAnswer: 2
        },
        {
            question: "What is Elviss mansion called?",
            options: ["Swampland", "Neverland", "Graceland", "Kingstown"],
            correctAnswer: 2
        },
        {
            question: "What town was Elvis born in?",
            options: ["Branson", "Tupelo", "Nashville", "Memphis"],
            correctAnswer: 1
        },
        {
            question: "He played Nicholas Bradford on the ultra popular 70s sitcom Eight is Enough.",
            options: ["Danny Pintauro", "Adam Rich", "Meeno Peluce", "Jason Bateman"],
            correctAnswer: 1
        },
        {
            question: "Rapper turned actor Will Smith married this actress in 1997.",
            options: ["Brandy Norwood", "Shia LeBeouf", "Jada Pinkett", "Nia Long"],
            correctAnswer: 2
        },
        {
            question: "Former tennis great Steffi Graf married this former tennis great in 2001.",
            options: ["Boris Becker", "Andre Agassi", "John McEnroe", "Jimmy Connors"],
            correctAnswer: 1
        },
        {
            question: "In 1997, Actor Matthew Broderick married this Sex and the City star.",
            options: ["Kim Catrall", "Sarah Jessica Parker", "Cynthia Nixon", "Kristen Davis"],
            correctAnswer: 1
        },
        {
            question: "What famous actor did Catherine Zeta Jones marry in 2000?",
            options: ["Jeff Bridges", "Michael Douglas", "Kirk Douglas", "Lloyd Bridges"],
            correctAnswer: 1
        },
        {
            question: "Actor James Brolin married this famous singer in 1998.",
            options: ["Aretha Franklin", "Barbra Streisand", "Bette Midler", "Maria Muldaur"],
            correctAnswer: 1
        },
        {
            question: "Singer Jennifer Lopez married this famous singer in 2004.",
            options: ["Gavin Rossdale", "Enrique Iglesias", "Dave Grohl", "Mark Anthony"],
            correctAnswer: 3
        },
        {
            question: "Actor Ben Stiller married this actress in 2000.",
            options: ["Nikki Taylor", "Pam Anderson", "Christine Taylor", "Heather Graham"],
            correctAnswer: 2
        },
        {
            question: "In 2002, pop diva Gwen Stefani married the former lead singer of the band Bush. What is the name of Stefanis significant other?",
            options: ["Ross Gavindale", "Nigel Pulsford", "Chris Traynor", "Gavin Rossdale"],
            correctAnswer: 3
        },
        {
            question: "What actor did Demi Moore marry in 2005?",
            options: ["Ashton Kutcher", "Patrick Dempsey", "Bruce Willis", "Brendan Fraser"],
            correctAnswer: 0
        },
        {
            question: "In 2005, actress Jennifer Garner married this Hollywood movie star.",
            options: ["Matt Damon", "Matt Houston", "Ben Affleck", "John Stamos"],
            correctAnswer: 2
        },
        {
            question: "This actor made his film debut in Rubberface and followed it with appearances in Copper Mountain, Once Bitten and Peggy Sue Got Married before he hit the big time.",
            options: ["Matt Dillon", "Jim Carrey", "Alan Cumming", "Dean Cain"],
            correctAnswer: 1
        },
        {
            question: "This American actor played the roles of Mr. Big in the 007 film Live and Let Die and Parker in the hit Sci-Fi movie Alien.  He later starred in the TV show Homicide: Life on the Street.",
            options: ["Nicholas Downs", "Yaphet Kotto", "George Chakiris", "Dana Carvey"],
            correctAnswer: 1
        },
        {
            question: "This British actor is the eldest of a pair of twins and who played George Weasley in the Harry Potter series of films.",
            options: ["Yaphet Kotto", "Oliver Phelps", "Sean Astin", "Samuel Sarpong"],
            correctAnswer: 1
        },
        {
            question: "This American actor was one of the child stars of The Goonies and also played a brave and helpful hobbit in Lord Of The Rings.",
            options: ["Sean Astin", "Norman Reedus", "Garrett Hedlund", "Orlando Bloom"],
            correctAnswer: 0
        },
        {
            question: "This American actor has received two Academy Award nominations for Best Actor in a Leading Role, winning it once for his portrayal of a suicidal alcoholic in Leaving Las Vegas.",
            options: ["Danny Glover", "Nicholas Cage", "Macaulay Culkin", "Steve Buscemi"],
            correctAnswer: 1
        },
        {
            question: "This British actor came to fame playing a drug addict in Trainspotting and has appeared in a variety of independent and blockbuster movies, including the recent Star Wars films.",
            options: ["Norman Wisdom", "Ian McKellen", "Ewan McGregor", "Ryan Reynolds"],
            correctAnswer: 2
        },
        {
            question: "This American is an actor, producer, director and general philanthropist.  He is responsible for setting up the Sundance Independent Film Festival.",
            options: ["Matthew Broderick", "Robert Redford", "Stephen Dorff", "Nick Nolte"],
            correctAnswer: 1
        },
        {
            question: "This British actor is mainly known for his portrayal of a schoolboy wizard, but has also appeared on stage naked!",
            options: ["Ewan McGregor", "Daniel Radcliffe", "Kenneth Branagh", "Frank Converse"],
            correctAnswer: 1
        },
        {
            question: "This versatile young actor has played a diverse range of characters in films, but is known best as a heroic little hobbit in Peter Jacksons blockbuster trilogy of Lord Of The Rings.",
            options: ["Edward Speleers", "Haley Joel Osment", "Ryan Reynolds", "Elijah Wood"],
            correctAnswer: 3
        },
        {
            question: "This British actor is probably best known for playing the villain Blofeld in the James Bond series of films and Dr. Loomis in the Halloween movies.",
            options: ["Samuel West", "Tom Baker", "Stuart Townsend", "Donald Pleasence"],
            correctAnswer: 3
        },
        {
            question: "Which actor, who played Legolas in The Lord of the Rings trilogy, was born on January 13, 1977?",
            options: ["Elijah Wood", "Sean Astin", "Orlando Bloom", "Viggo Mortensen"],
            correctAnswer: 2
        },
        {
            question: "What more than 10-time Grammy Award winning pop singer was born on February 2, 1977.",
            options: ["Mya", "Pink", "Shakira", "Nelly Furtado"],
            correctAnswer: 2
        },
        {
            question: "This actress, who starred in the movie I Know What You Did Last Summer, was born on April 14, 1977. What is her name?",
            options: ["Jennifer Love Hewitt", "Rachael Leigh Cook", "Sarah Michelle Gellar", "Brandy"],
            correctAnswer: 2
        },
        {
            question: "Which singer, born on January 28, 1977, was a member of the popular boy-band N Sync?",
            options: ["Joey Fatone", "Justin Timberlake", "Nick Carter", "Lance Bass"],
            correctAnswer: 0
        },
        {
            question: "This actor, who is also an animal rights activist, was born on August 2, 1977. He was arrested in Kentucky for attempting to free lobsters from a grocery store.",
            options: ["Macaulay Culkin", "Edward Norton", "Chris Klein", "Edward Furlong"],
            correctAnswer: 3
        },
        {
            question: "What instrument did Louis Armstrong play?",
            options: ["Violin", "Trumpet", "Clarinet", "Saxophone"],
            correctAnswer: 1
        },
        {
            question: "What instrument did jazz musician Benny Goodman play?",
            options: ["Clarinet", "Saxophone", "Drums", "Flute"],
            correctAnswer: 0
        },
        {
            question: "Prince can play the drums.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Matt Cameron, who has been a member of Soundgarden and Pearl Jam, plays what instrument?",
            options: ["Guitar", "Bass", "Keyboards", "Drums"],
            correctAnswer: 3
        },
        {
            question: "Bobby Militello of The Dave Brubeck Quartet plays the piano.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Adam Yauch, one of the founding members of the Beastie Boys, plays which of the following instruments?",
            options: ["Bass", "Keyboards", "Turntable", "Guitar"],
            correctAnswer: 0
        },
        {
            question: "Buddy Guy played a Fender Stratocaster.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "David Bowie plays many instruments, which of the below does he also play?",
            options: ["Flute", "Bass", "Cello", "French Horn"],
            correctAnswer: 2
        },
        {
            question: "Nick Rhodes from Duran Duran plays what instrument?",
            options: ["Drums", "Keyboards", "Symbols", "Tuba"],
            correctAnswer: 1
        },
        {
            question: "What is the middle name of John Stamos?",
            options: ["Roy", "Ronald", "Phillip", "Jesse"],
            correctAnswer: 2
        },
        {
            question: "Actor John Stamos didnt play in which one of these shows?",
            options: ["Full House", "Different Strokes", "General Hospital", "ER"],
            correctAnswer: 1
        },
        {
            question: "John Stamos original family name was Stamotopoulos.",
            options: ["True", "False"],
            correctAnswer: 0
        }
    ],
    'entertainment': [
        {
            question: "Greta Garbo was successfully treated for this disease.",
            options: ["Breast cancer", "Hepatitis", "Cirrhosis", "Tuberculosis"],
            correctAnswer: 0
        },
        {
            question: "In 1952, A.S. Douglas developed the first graphical game to run on a computer.  It ran on the EDSAC.  What was the name of this game?",
            options: ["OXO", "Go", "Tennis For Two", "Check It"],
            correctAnswer: 0
        },
        {
            question: "Nolan Bushnell is considered to be the father of the video arcade industry. In 1972 he founded his own game company and together with Ted Dabney and Al Alcorn released the first arcade video game with major success- Pong. What was the name of his company?",
            options: ["Nutting Associates", "Nintendo", "Sega", "Atari"],
            correctAnswer: 3
        },
        {
            question: "Pong was first installed at a high school.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "In 1972 a company named Waco released the first handheld electronic game. What was its name?",
            options: ["Tetris", "Cross", "Microvision", "Tic Tac Toe"],
            correctAnswer: 3
        },
        {
            question: "In 1978 Taito released one of the most influential arcade video games. It was called Space Invaders and marked the beginning of the Golden Age of arcade games. What was the thing that the player controlled in Space Invaders?",
            options: ["An anti-aircraft gun", "A cowboy", "An alien", "A movable laser cannon"],
            correctAnswer: 3
        },
        {
            question: "Mario, probably the best-known video game character, first appeared in Donkey Kong in 1981.  His brother Luigi first appeared in Mario Bros.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Nintendo is undoubtedly one of the most successful and best known console manufacturers. Nintendo has created several TV consoles and many handheld portables, such as the Game Boy and the Game  Watch. When was the company originally founded?",
            options: ["1983", "1953", "1985", "1889"],
            correctAnswer: 3
        },
        {
            question: "With the introduction of cheap and relatively powerful processors such as Intel 386, Intel 486 and Motorola 68000 3D-graphics became fashionable. It was used in FPS games like the legendary Wolfenstein 3D and Doom. Do you know what FPS stands for in this context?",
            options: ["Firing Per Second", "File Protocol System", "First Person Shooter", "Frames Per Second"],
            correctAnswer: 2
        },
        {
            question: "Sonic the Hedgehog is a mascot of Sony Playstation.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "When in 1996 3dfx released the Voodoo chipset, it made high-resolution and more-detailed 3D games possible. One of the first games to take advantage of this was Quake. Do you know which company released this marvelous game?",
            options: ["id Software", "Microsoft", "Blizzard", "Valve"],
            correctAnswer: 0
        },
        {
            question: "These fictional superheroes were born, when a container of radioactive waste bounced off a truck and struck a young boy, turning him into Daredevil.",
            options: ["Adolescent Radioactive Blackbelt Hamsters", "Miami Mice", "Pre-teen Dirty Jean Kung-fu Kangaroos", "Teenage Mutant Ninja Turtles"],
            correctAnswer: 3
        },
        {
            question: "This superhero, who first appeared in the comic book Tales of Suspense, used his own invention to keep his heart pumping.",
            options: ["Iron Man", "The Hulk", "Mr. Fantastic", "Ant Man"],
            correctAnswer: 0
        },
        {
            question: "This Marvel Comics superhero, whose birth name was Peter Benjamin Parker, first used his new found superpowers as a professional wrestler.",
            options: ["The Thing", "Spiderman", "Superman", "Green Arrow"],
            correctAnswer: 1
        },
        {
            question: "This comedic superhero, created by Ben Edlund, met an accountant named Arthur, after taking a long bus ride into The City.",
            options: ["Thor", "The Shadow", "The Tick", "Darkman"],
            correctAnswer: 2
        },
        {
            question: "These comic book superheroes were trained in Professor Xaviers School for Gifted Youngsters.",
            options: ["Power Pack", "The X-Men", "The Avengers", "The Fantastic Four"],
            correctAnswer: 1
        },
        {
            question: "Which Marvel Comics character became a ruthless vigilante, after witnessing his familys violent murder?",
            options: ["The Scourge", "The Crow", "The Punisher", "Judge Dredd"],
            correctAnswer: 2
        },
        {
            question: "This DC Comics superhero, whose true identity is Bruce Wayne, decided to train himself to the peak of physical perfection after witnessing the murder of his parents.",
            options: ["Batman", "Spawn", "V (For Vendetta)", "The Hulk"],
            correctAnswer: 0
        },
        {
            question: "Which fictional member ot the Teen Titans started out as Batmans sidekick?",
            options: ["Beast Boy", "Nightwing", "Raven", "Cyborg"],
            correctAnswer: 1
        },
        {
            question: "Fellow Justice League members Superman and Martian Manhunter have something in common. What is it?",
            options: ["They both grew up on a farm.", "They are both reporters by day", "They both escaped from the phantom zone.", "They are both aliens."],
            correctAnswer: 3
        },
        {
            question: "Which of the following fictional heroes is a World War II veteran?",
            options: ["Captain Commando", "Thor", "Batman", "Captain America"],
            correctAnswer: 3
        },
        {
            question: "What is the real name of Gambit who first appeared in the comic book The Uncanny X-Men?",
            options: ["Scott Summers", "Bobby LeBeau", "Remy LeBeau", "Alex Summers"],
            correctAnswer: 2
        },
        {
            question: "Which of these X-Men characters is not a member of the Summers family line?",
            options: ["Havoc", "Cyclops", "Mister Sinister", "Cable"],
            correctAnswer: 2
        },
        {
            question: "Archangel, a mutant and a member of the X-Men, was which horseman of Apocalypse?",
            options: ["Pestilence", "Death", "Famine", "War"],
            correctAnswer: 1
        },
        {
            question: "Which antagonist of the X-Men is responsible for the death of Wolverine in the comic books?",
            options: ["Magneto", "Juggarnaut", "Sabretooth", "Lady Deathstrike"],
            correctAnswer: 0
        },
        {
            question: "Which of these X-men characters is not a mutant?",
            options: ["Juggernaut", "Gambit", "Charles Xavier", "Storm"],
            correctAnswer: 0
        },
        {
            question: "In the Age of Apocalypse timeline, Wolverine, a member of the X-Men, is married to which female?",
            options: ["Jubilee", "Jean Grey", "Storm", "Polaris"],
            correctAnswer: 2
        },
        {
            question: "Who is the head of the X-Men in the Age of Apocalypse timeline?",
            options: ["Cyclops", "Apocalypse", "Magneto", "Charles Xavier"],
            correctAnswer: 2
        },
        {
            question: "Omega Red, a foe of the X-Men, serves which country?",
            options: ["Japan", "Germany", "The United States", "Russia"],
            correctAnswer: 3
        },
        {
            question: "What is the real name of X-Men member Wolverine?",
            options: ["Logan", "Victor Creed", "James Howlett", "Mikhail Rasputin"],
            correctAnswer: 2
        },
        {
            question: "This member of the Hellfire Clubs inner circle, known as the White Queen, once fought against the X-Men.",
            options: ["Calypso", "Jean Grey", "Emma Frost", "Phoenix"],
            correctAnswer: 2
        },
        {
            question: "When was the Miss America pageant first held?",
            options: ["September 7, 1921", "September 5, 1925", "July 6, 1920", "July 4, 1919"],
            correctAnswer: 0
        },
        {
            question: "The most common talents performed are singing and dancing, but there have been a variety of other odd talents as well.  Which talent was performed at a Miss America pageant?",
            options: ["Self-defense", "Gymnastic moves", "Blowing bubbles through a straw", "Packing a suitcase"],
            correctAnswer: 3
        },
        {
            question: "Who was the first Jewish Miss America?",
            options: ["Bess Myerson", "Marion Bergeron", "Norma Smallwood", "Marilyn Buferd"],
            correctAnswer: 0
        },
        {
            question: "Miss America always goes on to compete in the Miss Universe pageant.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "As of the beginning of the new millenium, how many Miss America title holders were from New Jersey, the state that held the competitions?",
            options: ["4", "2", "6", "0"],
            correctAnswer: 1
        },
        {
            question: "Who was the first deaf Miss America?",
            options: ["Rebecca Ann King", "Phyllis Ann George", "Heather Whitestone", "Cheryl Prewitt"],
            correctAnswer: 2
        },
        {
            question: "Until 2004 ABC aired the Miss America pageant , it then switched to what station?",
            options: ["CBS", "CMT", "USA", "NBC"],
            correctAnswer: 1
        },
        {
            question: "In what year did Snoopy first make his first appearance in a comic strip?",
            options: ["1950", "1954", "1948", "1952"],
            correctAnswer: 0
        },
        {
            question: "What name was Charles Schulz originally going to give to Charlie Browns dog Snoopy?",
            options: ["Sneakers", "Sneaky", "Snookums", "Sniffy"],
            correctAnswer: 3
        },
        {
            question: "What position did cartoon character Snoopy play in Charlie Browns Little League baseball team?",
            options: ["First base", "Pitcher", "Catcher", "Short Stop"],
            correctAnswer: 3
        },
        {
            question: "In what year did comic strip character Snoopy first appear sleeping on top of his doghouse?",
            options: ["1953", "1954", "1958", "1956"],
            correctAnswer: 2
        },
        {
            question: "In what year did comic strip character Snoopy first walk upright?",
            options: ["1962", "1956", "1960", "1958"],
            correctAnswer: 1
        },
        {
            question: "Which one of these pairs roller coaster- theme park is wrong?",
            options: ["Megafobia- Oakwood Leisure Park", "Avalanche- Holiday World", "Superman - Ride of Steel- Six Flags Darien Lake", "Dania Beach Hurricane- Boomers"],
            correctAnswer: 1
        },
        {
            question: "Top Thrill Dragster was opened in 2003 and it was the tallest and fastest roller coaster in the world until 2005 (this is true). It was the first roller coaster to break the 300 ft (91.4 m) barrier.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Which one of these pairs roller coaster- year of opening is wrong?",
            options: ["Ozark Wildcat- 2003", "Megafobia- 1996", "Kraken- 2000", "Nitro- 2000"],
            correctAnswer: 3
        },
        {
            question: "October 2006 saw the release of which Mortal Kombat game?",
            options: ["12th", "10th", "8th", "9th"],
            correctAnswer: 0
        },
        {
            question: "In the Mortal Kombat storyline, Liu Kang was brutally murdered by which character?",
            options: ["Shang Tsung", "Kung Lao", "Shao Kahn", "Goro"],
            correctAnswer: 0
        },
        {
            question: "What feature makes Kenshi different from all other Mortal Kombat characters?",
            options: ["He is a mute.", "He can fly.", "He is blind.", "He is deaf."],
            correctAnswer: 2
        },
        {
            question: "How does Calvins dad like to spend his vacation in the comic strip Calvin and Hobbes",
            options: ["Going Sightseeing", "Going Camping", "Going Hiking", "Going to the Beach"],
            correctAnswer: 1
        }
    ],
    'for-kids': [
        {
            question: "What is NOT one of Strong Bads favorite bands in the Internet cartoon Homestar Runner?",
            options: ["sloshy", "Limozeen", "Peter Frampton", "Taranchula"],
            correctAnswer: 0
        },
        {
            question: "Speaking of the famous fairy tale, that girl with the long hair was named which of these plants?",
            options: ["Turnip", "Rampion", "Lettuce", "Safflower"],
            correctAnswer: 1
        },
        {
            question: "Sleeping Beauty pricked her finger on the part of a spinning wheel that does this.",
            options: ["Twists the fibres into a thread", "Sorts the finished threads", "Collects the finished thread", "Powers the wheel"],
            correctAnswer: 0
        },
        {
            question: "Why does Cinderella wear a glass slipper?",
            options: ["Glass shoes sound like something a princess would wear.", "Vair (fur), was mistaken for verre (glass).", "Glass shoes were worn by royalty.", "They were a symbol of her purity."],
            correctAnswer: 0
        },
        {
            question: "The Little Mermaid refused to kill the prince, so she eventually ends up as this.",
            options: ["A daughter of the air.", "A block-buster animated film.", "Foam on the waves.", "A mermaid again."],
            correctAnswer: 0
        },
        {
            question: "Only one of the following descriptions of the features of Snow White is true.  Can you spot it?",
            options: ["Hemophiliac lips.", "Rosaceae cheeks.", "Ice crystal eyes.", "Wooden hair."],
            correctAnswer: 3
        },
        {
            question: "Referring to a well-known fairy tale, the millers daughter had to spin what?",
            options: ["Dry stalks of wheat.", "Dried stalks of marsh plant.", "Dry stalks of corn.", "Dry stalks of grass."],
            correctAnswer: 0
        },
        {
            question: "The witch in Hansel and Gretel was probably raised in this part of the world.",
            options: ["Eastern Europe", "Italy", "The Middle East", "England"],
            correctAnswer: 0
        },
        {
            question: "Referring to the popular fairy tale, what is the name of the goose girls enchanted horse?",
            options: ["Salada - white as salt", "Fallow - pale in colour", "Saladin - righteousness", "Falada - to speak"],
            correctAnswer: 3
        },
        {
            question: "Poor Eliza of the famous fairy tale, had to make eleven shirts of what plant?",
            options: ["Urticaria", "Belonidae", "Belladonna", "Urticaceae"],
            correctAnswer: 3
        },
        {
            question: "How many siblings does Ron have?",
            options: ["none", "3", "6", "8"],
            correctAnswer: 2
        },
        {
            question: "What does Ron hate the most about himself?",
            options: ["Being unpopular", "Being poor", "Being the youngest boy in his family", "Not being in Slytherin"],
            correctAnswer: 1
        },
        {
            question: "Who does Ron take to the Yule ball?",
            options: ["Ginny Weasley", "Padma Patil", "Hermione Granger", "Parvati Patil"],
            correctAnswer: 1
        },
        {
            question: "Rons mom is part of the order of the phoenix.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "What is Rons full name?",
            options: ["Ronald J. Weasley", "Ronald Arthur Weasley", "Ronald Perkins Weasley", "Ronald Bilius Weasley"],
            correctAnswer: 3
        },
        {
            question: "Has Ron ever been dead?",
            options: ["No", "Yes"],
            correctAnswer: 0
        },
        {
            question: "Who is Rons idol?",
            options: ["Viktor Krum", "Cedric Diggory", "Harry Potter", "Oliver Wood"],
            correctAnswer: 0
        },
        {
            question: "In which of the first six books does Ron face Voldemort?",
            options: ["Never", "Half-Blood Prince", "Sorcerers Stone", "Goblet of Fire"],
            correctAnswer: 0
        },
        {
            question: "Which charm did Doby the House Elf use to get Harry Potter in huge trouble with his Uncle?",
            options: ["A clutter charm", "A hover charm", "A disturbance charm", "A flutter charm"],
            correctAnswer: 1
        },
        {
            question: "What is the full name of Harry Potters Headmaster, as revealed in the 5th book?",
            options: ["Albus Percival Wulfric Brian Dumbledore", "Albus Wulfric Nicholas Dumbledore", "Albus Nicholas Abelforth Dumbledore", "Albus Abelforth Wulfric Brian Dumbledore"],
            correctAnswer: 0
        },
        {
            question: "Aside from a bit of the person you wish to become, what are the other ingredients used to make Polyjuice Potion, as seen in the 2nd book of Harry Potter?",
            options: ["Lacewing flies, leeches, powdered bicorn horn, knotgrass, fluxweed, and boomslang skin", "Porcupine quills, leeches, lacewing flies, valerian roots, and boomslang skin", "Moonstone, lacewing flies, boomslang skin, dried nettles, knotgrass, and bubotuber pus", "Powdered dragon horn, moonstone, lacewing flies, boomslang skin, dried nettles, and valerian roots"],
            correctAnswer: 0
        },
        {
            question: "In the first task of the Triwizard Tournament (Harry Potter and the Goblet of Fire ), each champion has to fight a different breed of dragon.  Which dragon does Fleur Delacour face?",
            options: ["Swedish Short-Snout", "Chinese Fireball", "Welsh Green", "Hungarian Horntail"],
            correctAnswer: 2
        },
        {
            question: "At Harry Potters trial during the 5th book, Madam Bones refers to Harrys patronus a corporal patronus.  What makes Harrys patronus corporal?",
            options: ["His patronus is strong enough to complete its intended task", "His patronus is so dependable that it becomes the same animal everytime", "His patronus is consistent enough to always have a defined shape to it", "His patronus is so well developed it has a commanding presence whenever it is conjured"],
            correctAnswer: 2
        },
        {
            question: "Harry Potters Dudley Dursley has had many traumatic encounters with wizards.  Which of the following has not happened to him?",
            options: ["His tongue is enlarged to almost 4 feet", "He breaks out in horrible zits", "He gets attacted by dementors", "He gets a pigs tail"],
            correctAnswer: 1
        },
        {
            question: "In the Harry Potter books, Fred and George invented a lot of products for their store, Weasleys Wizard Wheezes.  Which of the following products was not one invited by Fred and George?",
            options: ["Coughing Cakes", "Pygmy Puff", "Fever Fudge", "Self-Inking Quills"],
            correctAnswer: 0
        },
        {
            question: "In Harry Potter and the Prisoner of Azkaban, Hermione is given a time turner so she is able to make it to all of her extra classes.  Which of the following classes does she not take?",
            options: ["Ancient Runes", "Astronomy", "Alchemy", "Arithmancy"],
            correctAnswer: 2
        },
        {
            question: "Who was the last person Harry talked to in the book?",
            options: ["Ron", "Hermoine", "Hagrid", "Dumbledore"],
            correctAnswer: 1
        },
        {
            question: "What did the Dursleys send Harry for Christmas?",
            options: ["A fifty pence piece", "Nothing", "A sneak-o-scope", "An owl"],
            correctAnswer: 0
        },
        {
            question: "Rons sisters name is?",
            options: ["Ginny", "Grace", "Ginger", "George"],
            correctAnswer: 0
        },
        {
            question: "Hermoine broke her wrist when she fell off a broom.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Who is the poltergeist that lives at Hogwarts?",
            options: ["Pee-wee", "Peeves", "Pippy", "Petry"],
            correctAnswer: 1
        },
        {
            question: "What type of candy did Dumbledore offer McGonagell?",
            options: ["Lemon Drop", "Mr. Goodbar", "Cockroach Cluster", "Every Flavor Jellybeans"],
            correctAnswer: 0
        },
        {
            question: "Dudleys gang consisted of Piers, dennis, Malcolm and Gordon.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "What was the name of the Muggle school Harry was to attend?",
            options: ["St. Brutus", "Stonewall High", "Yale", "Stonebridge High"],
            correctAnswer: 1
        },
        {
            question: "Where did Harry buy his wand?",
            options: ["J.C. Penneys", "Ollivanders", "Flourish  Blotts", "Madame Malkins"],
            correctAnswer: 1
        },
        {
            question: "Who breaks Harry Potters nose in Harry Potter and the Half-Blood Prince, the sixth novel in the series?",
            options: ["Lucious Malfoy", "Lord Voldemort", "Proffesor Snape", "Draco Malfoy"],
            correctAnswer: 3
        },
        {
            question: "Does Draco Malfoy attempt to kill Dumbledore in the book Harry Potter and the Half-Blood Prince?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "Initially Harry Potter and Ron did not like Hermione and considered her annoying, interfering and snobby.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Who does Harry Potter kiss in the book Harry Potter and the Half-Blood Prince, after Gryffindor wins the Quidditch Cup?",
            options: ["Cho Chang", "Hermione Granger", "Nobody", "Ginny Weasley"],
            correctAnswer: 3
        },
        {
            question: "This fictional character suggests the name Dumbledores Army for the organization started by Harry, Hermione, and Ron in the book Harry Potter and the Order of the Phoenix.",
            options: ["Ginny Weasly", "Marietta Edgecombe", "Luna Lovegood", "Cho Chang"],
            correctAnswer: 0
        },
        {
            question: "In which book of the Harry Potter series, Harry, Ron and Hermione start attending the Divination class, taught by Professor Trelawney?",
            options: ["Harry Potter and the Half-Blood Prince", "Harry potter and the Order of the Phoniex", "Harry Potter and the Chamber of Secrets", "Harry Potter and the Prisoner of Azkaban"],
            correctAnswer: 3
        },
        {
            question: "In what year did J.K. Rowling receive an OBE (Order of the British Empire) from the Queen of England?",
            options: ["2001", "None of these", "2000", "1999"],
            correctAnswer: 2
        },
        {
            question: "Which of the following items cannot be found in a colonial classroom?",
            options: ["Fireplace", "Horn book", "Quill pen", "Crayon"],
            correctAnswer: 3
        },
        {
            question: "Colonial people spend some of their free time doing which of these?",
            options: ["Using a dishwasher", "Ordering pizza", "Skateboarding", "Reading McGuffey"],
            correctAnswer: 3
        },
        {
            question: "From age 12 to 21, American activist and politician Benjamin Franklin did what?",
            options: ["Worked on many inventions, including electricity", "Worked on his autobiography", "Went to school", "Worked as an apprentice"],
            correctAnswer: 3
        },
        {
            question: "In 1889, this person founded the Hull House, one of the first settlement houses in the U.S.",
            options: ["Betty Ross", "Harriet Tubman", "Jane Addams", "Florence Nightingale"],
            correctAnswer: 2
        },
        {
            question: "Which of the following is a famous quote by John Paul Jones, the well-known American naval hero from the American Revolutionary War?",
            options: ["I have a dream.", "I shall return.", "I have not yet begun to fight.", "Give me liberty or give me death."],
            correctAnswer: 2
        },
        {
            question: "Which of the following events is associated with Independence Day?",
            options: ["Boston Tea Party", "Declaration of Independence", "Louisiana Purchase", "Emancipation Proclamation"],
            correctAnswer: 1
        },
        {
            question: "What year did Columbus first arrive on American land?",
            options: ["1600", "1498", "1763", "1588"],
            correctAnswer: 1
        },
        {
            question: "You can see this animal around ant-hill. It is almost 6 feet long and it likes to eat ants.",
            options: ["Seal", "Kangaroo", "Anteater", "Dolphin"],
            correctAnswer: 2
        }
    ],
    'world': [
        {
            question: "LFD2 was banned in Australia.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "One of the remnants of this states former status as a possession of France is the fact that it was named after a French king.",
            options: ["Oklahoma", "Florida", "Louisiana", "Georgia"],
            correctAnswer: 2
        },
        {
            question: "No state has as many different species of mammals as this one. The average square mile of land contains 1.4 elk, 1.4 pronghorn antelope, and 3.3 deer.",
            options: ["Nevada", "Colorado", "Nebraska", "Montana"],
            correctAnswer: 3
        },
        {
            question: "Arizona became the 48th state on February 14, 1912.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "The largest lake in this state is Lake Okeechobee. The state is also home to one of the two naturally round lakes in the world.",
            options: ["Florida", "Hawaii", "Tennessee", "Alabama"],
            correctAnswer: 0
        },
        {
            question: "One of the following pairs (state - its capital) is wrong.",
            options: ["North Dakota - Fargo", "Kentucky - Frankfort", "Kansas - Topeka", "Maine - Augusta"],
            correctAnswer: 0
        },
        {
            question: "The 3rd Monday in April is Patriots Day - a legal holiday in this state.",
            options: ["Massachusetts", "Oregon", "California", "Washington"],
            correctAnswer: 0
        },
        {
            question: "Francis Drake was 66 years old at his inauguration and the oldest governor of this state.",
            options: ["Minnesota", "Nevada", "Iowa", "Ohio"],
            correctAnswer: 2
        },
        {
            question: "What is the state capital of Washington?",
            options: ["Spokane", "Olympia", "Walla Walla", "Seattle"],
            correctAnswer: 1
        },
        {
            question: "What is the state capital of Oregon?",
            options: ["Eugene", "Bend", "Portland", "Salem"],
            correctAnswer: 3
        },
        {
            question: "What is the state capital of California?",
            options: ["Sacramento", "San Diego", "Los Angeles", "San Francisco"],
            correctAnswer: 0
        },
        {
            question: "What is the state capital of Idaho?",
            options: ["Pocatello", "Boise", "Idaho Falls", "Coeur DAlene"],
            correctAnswer: 1
        },
        {
            question: "What is the state capital of Nevada?",
            options: ["Carson City", "Austin", "Reno", "Las vegas"],
            correctAnswer: 0
        },
        {
            question: "What is the state capital of Utah?",
            options: ["Salt Lake city", "Provo", "Price", "Cedar City"],
            correctAnswer: 0
        },
        {
            question: "What is the state capital of Arizona?",
            options: ["Tucson", "Flagstaff", "Kingman", "Phoenix"],
            correctAnswer: 3
        },
        {
            question: "What is the state capital of Alaska?",
            options: ["Fairbanks", "Anchorage", "Juneau", "Kodiak"],
            correctAnswer: 2
        },
        {
            question: "During World War II, this country was able to successfully defend its freedom and resist invasions by the Soviet Union - despite some loss of territory. It joined the European Union in 1995.",
            options: ["Lituania", "Czech Republic", "Poland", "Finland"],
            correctAnswer: 3
        },
        {
            question: "This country shares common boundaries with every South American country except Chile and Ecuador.",
            options: ["Bolivia", "Colombia", "Argentina", "Brazil"],
            correctAnswer: 3
        },
        {
            question: "After gaining its independence in 1991, it has retained closer political and economic ties to Russia than any of the other former Soviet republics.",
            options: ["Latvia", "Bulgaria", "Belarus", "Ukraine"],
            correctAnswer: 2
        },
        {
            question: "It was once the center of power for an empire.  Occupied by the allies in 1945, a state treaty ended its occupation in 1955 and recognized its independence.",
            options: ["Belgium", "Denmark", "Hungary", "Austria"],
            correctAnswer: 3
        },
        {
            question: "This country is home to the northernmost capital in mainland Europe?",
            options: ["Sweden", "Finland", "United Kingdom", "Denmark"],
            correctAnswer: 1
        },
        {
            question: "It is the sixth largest country and home of The Doctor breeze.",
            options: ["Ukraine", "Canada", "United Kingdom", "Australia"],
            correctAnswer: 3
        },
        {
            question: "Its three-year-old Socialist government was overthrown in 1973 by a dictatorial military regime led by Augusto Pinochet.",
            options: ["Peru", "Chile", "Paraguay", "Uruguay"],
            correctAnswer: 1
        },
        {
            question: "This country dominates the Aegian Sea and possesses an archipelago of about 2,000 islands.",
            options: ["Italy", "Greece", "Cyprus", "Turkey"],
            correctAnswer: 1
        },
        {
            question: "This country controls the Sinai Peninsula.  Following the completion of the Suez Canal in 1869, it became an important world transportation hub.",
            options: ["Egypt", "Thailand", "Hong Kong", "Libya"],
            correctAnswer: 0
        },
        {
            question: "This countrys national holidays include:",
            options: ["Mexico", "Chile", "Palestine", "Cuba"],
            correctAnswer: 3
        },
        {
            question: "The first American capital.  It has a nick name coined by musicians - it means  to play the big time.",
            options: ["Washington D.C.", "Boston", "New York", "San Francisco"],
            correctAnswer: 2
        },
        {
            question: "The cable cars of this city are the only mobile National Monument.",
            options: ["San Francisco", "Oklahoma", "Nevada", "Los Angeles"],
            correctAnswer: 0
        },
        {
            question: "When broken down into kanji, the name of this capital city means east and capital.",
            options: ["Osaka", "Kyoto", "Tokyo", "Nagoya"],
            correctAnswer: 2
        },
        {
            question: "The Seine river divides this city into the Rive Droite (French for Right Bank) north of the river and the Rive Gauche (French for Left Bank) south of the river.",
            options: ["Paris", "Marseille", "Lille", "Lyon"],
            correctAnswer: 0
        },
        {
            question: "This city situated south of China is made up of 230 islands, Lantau Island being the largest.",
            options: ["Taipei", "Hong Kong", "Peking", "Shanghai"],
            correctAnswer: 1
        },
        {
            question: "This city is the only one located on two continents.",
            options: ["Tanjer", "Istanbul", "Kadis", "Athens"],
            correctAnswer: 1
        },
        {
            question: "In the devilish year of  1666 a great fire occured in this European capital city. Half of it burned down.",
            options: ["London", "Paris", "Vienna", "Rome"],
            correctAnswer: 0
        },
        {
            question: "One of this citys most prominent landmarks is the Brandenburger Tor (Brandenburg Gate).  It once marked the boundary between East and West Germany.",
            options: ["Munchen", "Frankfurt", "Bonn", "Berlin"],
            correctAnswer: 3
        },
        {
            question: "This city is famous for its water-channel traffic. It has been designated a World Heritage Site.",
            options: ["Naples", "Rome", "Venice", "Barri"],
            correctAnswer: 2
        },
        {
            question: "This Peruvian city is stuck between the desert and the sea. It is also known as The City of the Kings.",
            options: ["Trujillo", "Cuzco", "Lima", "Chimbote"],
            correctAnswer: 2
        },
        {
            question: "Which of these U.S. states is not a Four Corners state?",
            options: ["Wyoming", "Utah", "Colorado", "New Mexico"],
            correctAnswer: 0
        },
        {
            question: "The Appalachian Trail divides two states as it makes its trek through Great Smoky Mountains National Park. Name the states it divides.",
            options: ["North Carolina and Tennessee.", "Georgia and Alabama.", "West Virginia and Maryland.", "New Hampshire and Maine."],
            correctAnswer: 0
        },
        {
            question: "Is the state of North Carolina south of the Mason - Dixon line?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "Sullivan street (in Sullivan County) serves as the state line, running east and west, effectively bi-locating this town in two states.  Name the city and the two states.",
            options: ["Latham,  Maryland,  Pennsylvania", "Memphis, Tennessee, Arkansas", "Bristol, Tennessee, Virginia", "Nogales, Arizona, New Mexico"],
            correctAnswer: 2
        },
        {
            question: "The town of San Ysidro is located in what state, near what border?",
            options: ["California, near the border with Mexico.", "California,  near the border with Arizona", "Washington, near the border with Oregon", "Iowa, near the border with Missouri"],
            correctAnswer: 0
        },
        {
            question: "The border between Georgia and Mississippi is also a time zone boundary.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Although Angel Falls bear the notion of something angelic, the phenomenon is named after Jimmy Angel, a barnstorming pilot from Missouri, who has become a modern legend.",
            options: ["Argentina", "Venezuela", "Panama", "Equador"],
            correctAnswer: 1
        },
        {
            question: "Mount Fuji is a nearly perfectly shaped volcano.  It has been worshipped as a sacred mountain.",
            options: ["China", "Japan", "Malaysia", "Thailand"],
            correctAnswer: 1
        },
        {
            question: "Mount Everest was formed some 50 million years ago. It rises a few meters each year because of geological forces. On the border between which two countries is this mount situated?",
            options: ["Nepal and India", "Sumatra and China", "China and Nepal", "Thailand and Nepal"],
            correctAnswer: 2
        },
        {
            question: "From forest to desert, the Grand Canyon has the most extreme nature climate.",
            options: ["Brazil", "USA", "Mexico", "Canada"],
            correctAnswer: 1
        },
        {
            question: "Through thousands of years in existence, Niagara Falls has been eroding at a rate of 4 feet (1.5 meters) per year.",
            options: ["Equador", "Canada", "Argentina", "Mexico"],
            correctAnswer: 1
        },
        {
            question: "The name of mount Kilimanjaro comes from Swahili and means the mountain that glitters.",
            options: ["Zambia", "Uruguai", "Zimbabwe", "Tanzania"],
            correctAnswer: 3
        },
        {
            question: "The Great Barrier Reef consists of many colonies of corals. That is why it is sometimes referred to as the largest living animal in the world.",
            options: ["Australia", "Armenia", "Anrgentina", "Austria"],
            correctAnswer: 0
        },
        {
            question: "Krakatoa volcano caused the most violent volcanic eruption recorded in worlds history.  In 1883, it destroyed 75 % of the territory of its island.",
            options: ["Thailand", "Malaysia", "Surinam", "Indonesia"],
            correctAnswer: 3
        }
    ],
    'video-games': [
        {
            question: "In what fictional city is the TV show Futurama set?",
            options: ["New New York", "New San Francisco", "None of these", "New Chicago"],
            correctAnswer: 0
        },
        {
            question: "What is the lowest ranking species in the Covenant hierarchy in the Halo series?",
            options: ["Drone", "Brute", "Grunt", "Elite"],
            correctAnswer: 2
        },
        {
            question: "Who controls the Flood in the Halo series?",
            options: ["The Prophet of Truth", "The Arbiter", "Gravemind", "No one"],
            correctAnswer: 2
        },
        {
            question: "What is a SPARTAN in the Halo series?",
            options: ["All of these", "A Genetically modified super soldier", "Troopers that went through military training at the age of five", "A higher ranking soldier than a ODST"],
            correctAnswer: 0
        },
        {
            question: "What species is the Didact in the Halo series?",
            options: ["Promethean", "Forerunner", "Precursor", "Yamne"],
            correctAnswer: 1
        },
        {
            question: "In the Halo series, Zealots use Energy Swords.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Which of the following does the UNSC use to transport troops in the halo series?",
            options: ["Pelicans", "Hornets", "Falcons", "Phantoms"],
            correctAnswer: 0
        },
        {
            question: "What does UNSC stand for in the Halo series?",
            options: ["None of the above", "United Nations Space Command", "United Nations Space Council", "Unified Nations Supreme Court"],
            correctAnswer: 1
        },
        {
            question: "What is the largest UNSC ship in the Halo series?",
            options: ["UNSC Infinity", "UNSC Spirit of Fire", "UNSC In Amber Clad", "UNSC Pillar of Autumn"],
            correctAnswer: 0
        },
        {
            question: "What city does Halo 3 ODST take place in?",
            options: ["New York", "New Mombasa", "Toronto", "Voi"],
            correctAnswer: 1
        },
        {
            question: "What is the largest species of the Covenant in the Halo series?",
            options: ["Elite", "Brute", "Jackal", "Hunter"],
            correctAnswer: 3
        },
        {
            question: "Who made the fictional Mother Brain and for what purpose?",
            options: ["The Galactic Federation built her as a next generation Aurora Unit.", "It is unknown who made her but she was made to control Zebes.", "The Space Pirates built her to be one of their generals.", "The Chozo built her to be a organic Supercomputer."],
            correctAnswer: 3
        },
        {
            question: "How did the Alimbics become extinct in the Metroid series?",
            options: ["The entire species used up their life energy to imprison Gorea.", "They discovered Phazon and developed Phazon Madness causing them to wipe each other out.", "Gorea wiped them out.", "The Metroids wiped them out."],
            correctAnswer: 0
        },
        {
            question: "What creature passes on the X Parasite to Samus in the Metroid series?",
            options: ["Space Pirate", "Kihunter", "Hornoad", "Metroid"],
            correctAnswer: 2
        },
        {
            question: "Who is the Deleter in the Metroid series?",
            options: ["Lyle Smithsonian", "K.G Misawa", "Adam Malkovich", "James Pierce"],
            correctAnswer: 3
        },
        {
            question: "Kraid is the only one of his species encountered in the Metroid game.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "What do Steamlords keep as pets in the Metroid series of games?",
            options: ["Steamspider", "Steambot", "Vaporwing", "Warp Hound"],
            correctAnswer: 2
        },
        {
            question: "An ancient Chozo prophecy predicts the coming of Phazon and the Metroid Prime. In this prophecy the Metroid Prime is referred to as which of the following?",
            options: ["Destroyer", "Worm", "Consumer", "Beast"],
            correctAnswer: 1
        },
        {
            question: "King Worm can be fought after Mother Brainin Metroid Zero Mission.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "What planet are Kihunters from in the Metroid games?",
            options: ["SR388", "Space Pirate Homeworld", "Unknown", "Zebes"],
            correctAnswer: 2
        },
        {
            question: "What planet is Samus from  in the Metorid games?",
            options: ["Norion", "Zebes", "It is unknown", "K-2L"],
            correctAnswer: 3
        },
        {
            question: "What is the name of the enemy faction in the first N.O.V.A?",
            options: ["Xenos", "Volterites", "Judgers", "The Dominion"],
            correctAnswer: 0
        },
        {
            question: "The N.O.V.A 3 Shotgun is both semi and fully automatic.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "On which planet does the first two missions in N.O.V.A 2 take place?",
            options: ["Sagittarius", "New Ceres", "Aquarius", "Earth"],
            correctAnswer: 2
        },
        {
            question: "Who helps Kal Wardin find the Judger artifact aboard Therrius in N.O.V.A?",
            options: ["Prometheus", "MazRah", "Yelena", "Rufus"],
            correctAnswer: 1
        },
        {
            question: "In N.O.V.A, Kal Wardin is rewarded for finding out what happened aboard the Colonial Pride by almost being killed.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Who is the leader of the Volterites in N.O.V.A?",
            options: ["The Overseer", "MazRah", "Prometheus", "None of the above"],
            correctAnswer: 0
        },
        {
            question: "Which Xeno is capable of teleporting in N.O.V.A?",
            options: ["Imp", "Red Demon", "Heavy Demon", "Fiend"],
            correctAnswer: 2
        },
        {
            question: "In N.O.V.A, President Folson is unarmed.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Boreas is the only desert planet in the N.O.V.A series.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "What is the name of the damsel you have to save in the classic arcade game Donkey Kong?",
            options: ["Pauline", "Daisy", "Dixie Kong", "Peach"],
            correctAnswer: 0
        },
        {
            question: "Which of these was a name that game character, Mario, was once called?",
            options: ["Koopa", "Luigi", "Plumberio", "Jumpman"],
            correctAnswer: 3
        },
        {
            question: "Who or what turned Warios treasure into monsters in the game, Wario World?",
            options: ["Lemmy Koopa", "The black jewel", "Kemmy Koopa", "Bowser"],
            correctAnswer: 1
        },
        {
            question: "In the Mario games, what animal is a paratroopa?",
            options: ["A bird", "A tiger", "A turtle", "A lizard"],
            correctAnswer: 2
        },
        {
            question: "When first created, Mario game character, Birdo, was what?",
            options: ["A girl", "A dog", "A boy", "A bird"],
            correctAnswer: 2
        },
        {
            question: "In the video games of Mario, is Luigi Marios cousin?",
            options: ["No", "Yes"],
            correctAnswer: 0
        },
        {
            question: "In the Mario video games, Bowser is the king of what?",
            options: ["Koopas", "The Jungle", "Bowsers", "Mushroom Kingdom"],
            correctAnswer: 0
        },
        {
            question: "Who is the last boss in video game Paper Mario 2?",
            options: ["Gloom Tail", "Cackletta", "Bowser", "Shadow Queen"],
            correctAnswer: 3
        },
        {
            question: "Which movie is this Warcraft 3 quote from?",
            options: ["For a Fistful of Dollars", "andit: -What we have here is a failure to communicate.", "Metal Man", "Dirty Sanchez", "Cool Hand Luke"],
            correctAnswer: 4
        },
        {
            question: "Where does the popular video game character Mario live?",
            options: ["The Mushroom Kingdom", "Yoshi Island", "The Kingdom of Sarasaland", "The Koopa Kingdom"],
            correctAnswer: 0
        },
        {
            question: "What is Marios nationality according to Nintendo video games?",
            options: ["Mexican", "American", "British", "Italian"],
            correctAnswer: 3
        },
        {
            question: "Has the video game character Mario ever been in a TV show?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "What was the first video game in which Mario appeared?",
            options: ["The Mario Bros.", "Mario", "Super Mario", "Donkey Kong"],
            correctAnswer: 3
        },
        {
            question: "Why does Mario wear a red cap in the Mario series of games?",
            options: ["He cant make his hair neat.", "He likes his cap.", "The creators didnt have the technology to animate his hair.", "He is bald."],
            correctAnswer: 2
        },
        {
            question: "Has Nintendo character Mario ever been a bad guy?",
            options: ["Yes", "No"],
            correctAnswer: 0
        },
        {
            question: "What does the Fire Flower do to Mario in the Mario video games?",
            options: ["Allows him to breath fire.", "Nothing", "It makes him angry.", "Allows him to throw fire balls."],
            correctAnswer: 3
        },
        {
            question: "What effect does the Super Mushroom have on Mario in the popular series of video games?",
            options: ["It makes him smaller.", "It makes him bigger.", "It makes him impervious to danger.", "None"],
            correctAnswer: 1
        },
        {
            question: "In the Mario series of video games, Mario never uses any weapons.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "What is Marios occupation in the Mario series of games?",
            options: ["engineer", "electrician", "doctor", "plumber"],
            correctAnswer: 3
        },
        {
            question: "What is the name of the land where most of the Legend of Zelda games take place?",
            options: ["Sacred Realm", "Termania", "Hylia", "Hyrule"],
            correctAnswer: 3
        }
    ],
    'newest': [
        {
            question: "In how many provinces is the Dominican Republic divided?",
            options: ["11", "None of these", "21", "31"],
            correctAnswer: 3
        },
        {
            question: "#10 on the list of highest-grossing films is this Disney animated feature film, which came out in 1937 and earned $1,746,100,000.",
            options: ["101 Dalmatians", "Snow White and the Seven Dwarfs", "The Three Caballeros", "Fantasia 2000"],
            correctAnswer: 1
        },
        {
            question: "# 9 on the list of highest-grossing films is this 1975 film that earned $1,945,100,000 and scared the pants off most of the audience. In fact, people swimming in the ocean dropped that year.",
            options: ["Jaws 3-D", "Great White", "Jaws 2", "Jaws"],
            correctAnswer: 3
        },
        {
            question: "#8 on the list of highest-grossing films is a 1965 film about the Russian Revolution in 1917-1918 and grossed $1,988,600,000.",
            options: ["Doctor Zhivago", "Reds", "Anastasia", "October: Ten Days That Shook the World"],
            correctAnswer: 0
        },
        {
            question: "#7 on the list of highest-grossing films was this 1956 religious film starring Charlton Heston. It grossed $2,098,600,000.",
            options: ["The Prince of Egypt", "The Ten Commandments", "Ben-Hur", "Samson and Delilah"],
            correctAnswer: 1
        },
        {
            question: "#6 on the list of highest-grossing films is a 1982 sci-fi movie by Steven Spielberg, which grossed $2,216,800,000.",
            options: ["E.T. the Extra-Terrestrial", "Blade Runner", "The Thing", "Star Trek II: The Wrath of Khan"],
            correctAnswer: 0
        },
        {
            question: "#5 on the list of highest-grossing films is a musical which takes place in Austria. It was made in 1965 and grossed $2,269,800,000. Sing the scales for me on a hill top.",
            options: ["Help!", "The Sound of Music", "Beach Blanket Bingo", "The Great Race"],
            correctAnswer: 1
        },
        {
            question: "#4 on the list of highest-grossing films is based on a real event. It was made in 1997 and grossed $2,413,800,000. It will leave your heart sinking in the end but Im sure it will go on.",
            options: ["Titanic", "The Poseidon Adventure", "The Abyss", "The Hunt for Red October"],
            correctAnswer: 0
        },
        {
            question: "#3 on the list of highest-grossing films is this 1977 sci-fi movie thats had so many sequels and prequels, Ive lost count. It grossed $2,710,800,000.",
            options: ["Star Wars", "The Island of Dr. Moreau", "The Incredible Hulk", "Close Encounters of the Third Kind"],
            correctAnswer: 0
        },
        {
            question: "#2 on the list of highest-grossing films is the only one from the 21st century. It features weird colorful figures. It grossed $2,782,300,000.",
            options: ["Harry Potter and the Deathly Hallows, Part II", "Transformers: Dark of the Moon", "Avatar", "The Twilight Saga: Breaking Dawn Part I"],
            correctAnswer: 2
        },
        {
            question: "#1 on the list of highest-grossing films is about the American South. It grossed $3,301,400,000.",
            options: ["All Quiet on the Western Front", "Gone With the Wind", "Cleopatra", "Ben-Hur"],
            correctAnswer: 1
        },
        {
            question: "This 1973 horror film was the second of many devilish movies.",
            options: ["Rosemarys Baby", "The Omen", "The Exorcism of Emily Rose", "The Exorcist"],
            correctAnswer: 3
        },
        {
            question: "What movie title was translated in Mexico as title Grow, Run and Stumble?",
            options: ["Juno", "Four Friends", "Rachel Getting Married", "All or Nothing"],
            correctAnswer: 0
        },
        {
            question: "In Spain this movie title was translated as Pigs And Diamonds.",
            options: ["Marathon Man", "Snatch", "Donnie Brasco", "Unforgiven"],
            correctAnswer: 1
        },
        {
            question: "To the Devil with the Devil is the Mexican title of this movie.",
            options: ["Ghost Busters", "The Witches of Eastwick", "Bedazzled", "Dogma"],
            correctAnswer: 2
        },
        {
            question: "What movie title was translated in Mexico as Dumb But Not That Dumb?",
            options: ["Billy Madison", "Besieged", "The Station Agent", "The Butterfly Effect"],
            correctAnswer: 0
        },
        {
            question: "What movie title was translated in Italy as Four Bastards for a Room in Hell?",
            options: ["Shark!", "Horror", "Hellboy", "The Order"],
            correctAnswer: 0
        },
        {
            question: "No Rules in Love is the Italian title of this movie.",
            options: ["Offside", "Leatherheads", "The Blind Side", "Dear Frankie"],
            correctAnswer: 1
        },
        {
            question: "The Secret Is In the Sauce is the French title of this movie.",
            options: ["Waitress", "Cure", "Paul Blart: Mall Cop", "Fried Green Tomatoes"],
            correctAnswer: 3
        },
        {
            question: "The Teeth From the Sea is the French title of this movie.",
            options: ["Open Water", "Jaws", "Shark in Venice", "The Reef"],
            correctAnswer: 1
        },
        {
            question: "This war movie is titled Voyage to the End of Hell in France.",
            options: ["A Tale of Five Cities", "Voyage of the Damned", "The Deer Hunter", "Sealed Cargo"],
            correctAnswer: 2
        },
        {
            question: "What movie was titled Sexy Dance in France?",
            options: ["Step Up", "Biloxi Blues", "Billy Elliot", "Delhi Belly"],
            correctAnswer: 0
        },
        {
            question: "A Supertough Kangaroo is the Spanish title of this movie.",
            options: ["Chocolat", "The Pacifier", "Mogambo", "Crocodile Dundee"],
            correctAnswer: 1
        },
        {
            question: "Breaking the Ice is the Spanish title of this movie.",
            options: ["Happy Feet", "The Last Airbender", "The Incredibles", "The Golden Compass"],
            correctAnswer: 0
        },
        {
            question: "Airport Attack is the Portuguese title of this movie.",
            options: ["Heat", "Snakes on a Plane", "Delta Force 2", "Die Hard 2"],
            correctAnswer: 3
        },
        {
            question: "What movie title was translated i Portugal as A Very Crazy Dead Man?",
            options: ["Kiss Kiss Bang Bang", "Weekend at Bernies", "Waking Ned", "Shaun of the Dead"],
            correctAnswer: 1
        },
        {
            question: "The 8th Passenger is Death is the Hungarian title of this movie.",
            options: ["Alien", "Taxi Driver", "Broken Flowers", "The Sky Dragon"],
            correctAnswer: 0
        },
        {
            question: "Popes have always been elected to their position by the College of Cardinals.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "How many votes from the College of Cardinals does it take to declare a new Pope?",
            options: ["Two thirds of the votes", "Half of the votes plus one", "Half of the votes", "Two thirds of the votes plus one"],
            correctAnswer: 3
        },
        {
            question: "What was the longest interregnum between popes?",
            options: ["14 months", "Five years and 2 months", "Two years and 9 months", "8 months"],
            correctAnswer: 2
        },
        {
            question: "Can any baptized male be elected Pope?",
            options: ["Yes", "No"],
            correctAnswer: 0
        },
        {
            question: "White smoke has always been used to announce the choosing of a new pope.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "All cardinals are appointed to their positions by a pope. Can they all vote for a new pope when the time comes?",
            options: ["No", "Yes"],
            correctAnswer: 0
        },
        {
            question: "Urban VII set a record for the shortest papacy. How many days was he in office?",
            options: ["184 days", "102 days", "33 days", "12 days"],
            correctAnswer: 3
        },
        {
            question: "If you were elected pope, what would your chances of becoming a saint be?",
            options: ["1 out of 3", "1 out of 4", "1 out of 6", "1 out of 10"],
            correctAnswer: 0
        },
        {
            question: "Why do popes wear white?",
            options: ["It signifies that the pope will not get dirty.", "It is easy to recognize him in a crowd.", "It was a fashion trend in 1566 brought on by the newly elected Pope Pius V.", "It symbolizes pure light."],
            correctAnswer: 2
        },
        {
            question: "Who was the first pope to change his name?",
            options: ["Pope Innocent XIII, formerly Michaelangelo", "Pope Sylvester II, formerly Gerbert", "Pope John II, formerly Mercury", "Pope Pius III, formerly Francesco"],
            correctAnswer: 2
        },
        {
            question: "I made a pun in springtime. (Next sentence, please)",
            options: ["It was a May zing.", "It was really winter", "It was amazing.", "It was stupid"],
            correctAnswer: 0
        },
        {
            question: "Magician’s assistants are _______________.",
            options: ["highly sawed after", "insurance deficient", "dumb to say the least", "highly sought after"],
            correctAnswer: 0
        },
        {
            question: "I dated a politician over the holidays but when I wrapped myself up as a present, he couldnt __________________.",
            options: ["get a committee organized to suggest a solution", "understand what he was supposed to do since his aides were on vacation", "cut through the red tape", "tear himself away from his cell phone"],
            correctAnswer: 2
        },
        {
            question: "I missed my miniature Indian musical instrument practice last night. I couldnt find a ___________.",
            options: ["baby sitar", "taxi", "baby sitter", "small enough violin"],
            correctAnswer: 0
        },
        {
            question: "Two coin collectors got together for _______________.",
            options: ["quarter of an hour", "old dimes sake", "old times sake", "pennies from heaven"],
            correctAnswer: 1
        },
        {
            question: "When I found out that the fire department was charging $75.00 per table for their craft fair I told them _________________.",
            options: ["they could go to Hades", "they could go to blazes", "that it seemed steep to me", "they could stick it where the sun dont shine"],
            correctAnswer: 1
        },
        {
            question: "I try wearing tight jeans, but I can __________________.",
            options: ["never pull it off", "not stand anything that sticks out", "gain weight while they are on my body.", "never relate to fashion"],
            correctAnswer: 0
        },
        {
            question: "I think Santa has riverfront property in Brazil. All our presents came from ____________.",
            options: ["Ipanina", "Amazon this year", "Deep in the Jungle", "Rio de Janeiro"],
            correctAnswer: 1
        },
        {
            question: "If I tell you I’m afraid of apple orchards, will you tell me to ______________?",
            options: ["grow a pair", "quit while your a  head", "grow a pear", "grow avocados"],
            correctAnswer: 2
        },
        {
            question: "If you step onto a plane and recognize a friend of yours named Jack dont yell out ______!",
            options: ["Man you look heavier than ever", "Jack, whats in your backpack", "On, no", "Hi Jack"],
            correctAnswer: 3
        },
        {
            question: "When asked by a passenger how high he would get, the pilot replied,",
            options: ["Higher than the highest mountain", "Whats it to you?", "I dont do drugs.", "higher than the ground"],
            correctAnswer: 2
        },
        {
            question: "The airlines have become so cash-strapped, they charged me for ___________.",
            options: ["my hat", "looking like a nuisance", "being overweight", "my emotional baggage"],
            correctAnswer: 3
        },
        {
            question: "Dont expect to eat something fancy when youre flying ___________________.",
            options: ["unless youre a good tipper", "because its plane food", "unless you bring your own food", "because its plain food"],
            correctAnswer: 1
        }
    ],
    'sports': [
        {
            question: "What science did Aristotle define as âthe knowledge of immaterial beingâ?",
            options: ["Psychology", "Logic", "Philosophy", "Metaphysics"],
            correctAnswer: 3
        },
        {
            question: "Which WWF group does this theme music belong to?",
            options: ["Hart Foundation", "D-Generation X", "Legion of Doom", "Nation of Domination"],
            correctAnswer: 1
        },
        {
            question: "What position is former Major League Baseball player, Rollie Fingers famous for playing?",
            options: ["First Base", "Third Base", "Pitcher", "Catcher"],
            correctAnswer: 2
        },
        {
            question: "What position is former baseball player for the Cincinnati Reds, Johnny Bench famous for playing?",
            options: ["Shortstop", "Catcher", "Pitcher", "Second Base"],
            correctAnswer: 1
        },
        {
            question: "Baltimore Orioles, Cal Ripken Jr. is most known for playing what position?",
            options: ["Shortstop", "Catcher", "Right Field", "Pitcher"],
            correctAnswer: 0
        },
        {
            question: "Steve Garvey is a famous former baseball player, who is known for playing what position?",
            options: ["Shortstop", "Third Base", "First Base", "Catcher"],
            correctAnswer: 2
        },
        {
            question: "What position is former Major League Baseball player, Joe Morgan most known to have played?",
            options: ["Second Base", "None of these", "Outfield", "Catcher"],
            correctAnswer: 0
        },
        {
            question: "What position is former professional baseball player, Mike Schmidt famous for playing?",
            options: ["Pitcher", "Third Base", "Catcher", "Second Base"],
            correctAnswer: 1
        },
        {
            question: "Which of these positions is former baseball player, Dwight Evans most famous for?",
            options: ["Right Field", "Pitcher", "Center Field", "Second Base"],
            correctAnswer: 0
        },
        {
            question: "Successful Major League Baseball player and coach, Donald Edward Don Gullett, was famous for playing what position?",
            options: ["Catcher", "Pitcher", "Second Base", "Right Field"],
            correctAnswer: 1
        },
        {
            question: "Whitey Ford was a successful Major League Baseball player, who played in what position?",
            options: ["Pitcher", "Catcher", "First Base", "Shortstop"],
            correctAnswer: 0
        },
        {
            question: "Carlton Fisk was a successful Major League Baseball player, who played for 24 years with the Boston Red Sox and Chicago White Sox, in what position?",
            options: ["Left Field", "Pitcher", "Catcher", "None of the Above"],
            correctAnswer: 2
        },
        {
            question: "The Pittsburgh Steelers of the 50s had a third string quarterback from Louisville, who was not making it. They cut him and he landed with the Colts. Who was he?",
            options: ["Bert Jones Jr", "Johnny Unitas", "Len Dawson", "Terry Bradshaw"],
            correctAnswer: 1
        },
        {
            question: "Which was the first football team to win back to back Super Bowls with different coaches?",
            options: ["Dallas", "San Francisco", "Miami", "Pittsburgh"],
            correctAnswer: 1
        },
        {
            question: "How many points did Wilt Chamberlain score in his best game versus New York?",
            options: ["71", "82", "99", "100"],
            correctAnswer: 3
        },
        {
            question: "He is the youngest NBA player to score 10,000 points.",
            options: ["Moses Malone", "Kobe Bryant", "Spud Webb", "Michael Jordon"],
            correctAnswer: 1
        },
        {
            question: "He is the shortest player ever to win the Slam Dunk Contest.",
            options: ["Vince Carter", "Tracy McGrady", "Spud Webb", "Kobe Bryant"],
            correctAnswer: 2
        },
        {
            question: "He retired with the NBAs highest scoring average (30.1 points per game).",
            options: ["Michael Jordan", "Jarmaine ONeal", "Dwyane Wade", "Shaquille ONeal"],
            correctAnswer: 0
        },
        {
            question: "Karl Malone received the award Most Valuable Player in 1996-97. What team did he play for?",
            options: ["Utah Jazz", "Sacramento Kings", "Miami Heat", "LA Lakers"],
            correctAnswer: 0
        },
        {
            question: "He is the NBAs All-Time scorer.",
            options: ["Michael Jordan", "Kareem Abdul-Jabbar", "Ken Johnson", "Clyde Lovelette"],
            correctAnswer: 1
        },
        {
            question: "Wilt Chamberlain is a great player indeed. In a game against the Celtics he made the best rebounding effort ever. How many rebounds did he make in this famous game?",
            options: ["55", "16", "31", "57"],
            correctAnswer: 0
        },
        {
            question: "Who is the first player to top 20,000 points in NBA?",
            options: ["Wilt Chamberlain", "Bob Pettit", "Spud Webb", "Clyde Drexler"],
            correctAnswer: 1
        },
        {
            question: "George Muresan and Manute Bol are the tallest players in NBA history. How tall are they?",
            options: ["78 (2.33m)", "77 (2.31m)", "72 (2.18m)", "74 (2.23m)"],
            correctAnswer: 1
        },
        {
            question: "Who is the shortest player in the history of NBA?",
            options: ["Larry Bird", "Spud Webb", "Tyronne Bogues", "Eddie Griffin"],
            correctAnswer: 2
        },
        {
            question: "He was a player, coach, and owner  -all for one team. He was also instrumental in developing the NFL.",
            options: ["Wellington Mara", "Red Grange", "George Halas", "Pete Rozelle"],
            correctAnswer: 2
        },
        {
            question: "This college and pro great had a very strange nickname -Crazy Legs.   His last name was Hirsch.  What was his real first name ?",
            options: ["Elroy", "Arnie", "Cliff", "Lester"],
            correctAnswer: 0
        },
        {
            question: "Compton Junior College gave us this all-time great runner, who played fullback and was nicknamed Joe the Jet.",
            options: ["Sanders", "Perry", "Neale", "Battles"],
            correctAnswer: 1
        },
        {
            question: "His real name is Yelverton Abraham, and he played for San Francisco as well as the NY Giants. He attended LSU.",
            options: ["Groza", "Motley", "Strong", "Tittle"],
            correctAnswer: 3
        },
        {
            question: "This great sportsman was the first football player to be all-pro at defensive back one year and running back another.",
            options: ["Haynes", "Gifford", "Grange", "Thorpe"],
            correctAnswer: 1
        },
        {
            question: "This quarterback was cut by the Steelers and picked up by another team, played in high tops, and his teammates include Lenny Moore and Steve Myhra.",
            options: ["Norm Van Brocklin", "Johnny Unitas", "Terry Bradshaw", "John Brodie"],
            correctAnswer: 1
        },
        {
            question: "This great defensive end came from South Carolina State and played for the Rams. He is credited with inventing the head slap move.",
            options: ["David Jones", "Rosy Grier", "Merlin  Olsen", "Lamar Lundy"],
            correctAnswer: 0
        },
        {
            question: "This great running back was once traded for eleven players.  He had great speed and great moves, returned kicks, caught passes, and ran the ball.",
            options: ["Marcus Allen", "Dick Lane", "Ollie Matson", "Barry Sanders"],
            correctAnswer: 2
        },
        {
            question: "This great football player is known for catching the immaculate reception .",
            options: ["Lynn Swann", "Franco Harris", "John Stallworth", "O.J. Simpson"],
            correctAnswer: 1
        },
        {
            question: "Many of the greatest coaches, both pro and college, trace their learning to Miami University of Ohio and the teachings of this coaching great, who led Cleveland to many championships.",
            options: ["Weeb Ewbank", "Don Shula", "Paul Brown", "Woody  Hayes"],
            correctAnswer: 2
        },
        {
            question: "When did Miami Heat enter the NBA?",
            options: ["1958", "1988", "1974", "1963"],
            correctAnswer: 1
        },
        {
            question: "How many teams does the Atlantic Division of the Eastern Conference have?",
            options: ["5", "7", "4", "10"],
            correctAnswer: 0
        },
        {
            question: "Larry Brown led this team from 1997 to 2003.",
            options: ["LA Lakers", "Philadephia 76ers", "Chicago Bulls", "Denver Nuggets"],
            correctAnswer: 1
        },
        {
            question: "Mark Price, Larry Nance, Brad Daugerty, Shawn Kemp and Austin Carr have been chosen to be this teams all-time starting five.",
            options: ["Denver Nuggets", "Houston Rockets", "Philadelphia 76ers", "Cleveland Cavaliers"],
            correctAnswer: 3
        },
        {
            question: "This team is one of the five playing in the Southwest Division of the Western Conference. Tracy McGrady (as of 2005)  plays for this team.",
            options: ["Minnesota Timberwolves", "San Antonio Spurs", "Utah Jazz", "Houston Rockets"],
            correctAnswer: 3
        },
        {
            question: "Arguably the most famous NBA team. Michael Jordan played for this team.",
            options: ["Utah Jazz", "Sacramento Kings", "Miami Heat", "Chicago Bulls"],
            correctAnswer: 3
        },
        {
            question: "Which division do the Sacramento Kings play in?",
            options: ["Central Division of the Eastern Conference", "Pacific Division of the Western Conference", "Atlantic Division of the Eastern Conference", "Southwest Division of the Western Conference"],
            correctAnswer: 1
        },
        {
            question: "This team drafted and then exchanged for another player Chris Webber in 1993.",
            options: ["Golden State Warriors", "Sacramento Kings", "Orlando Magic", "Miami Heat"],
            correctAnswer: 2
        },
        {
            question: "This team won its first division title in the 1969-70 season, when Spencer Heywood signed with the club.",
            options: ["Philadelphia 76ers", "Denver Nuggets", "Detroit Pistons", "Chicago Bulls"],
            correctAnswer: 1
        },
        {
            question: "This team moved to Detroit in 1957. It was founded by Fred Zollner in 1940.",
            options: ["Pistons", "Knicks", "Warriors", "Lakers"],
            correctAnswer: 0
        },
        {
            question: "Which of these people founded the World Wrestling Entertainment, Inc?",
            options: ["Shane McHamon", "Hulk Hogan", "Ric Flair", "Vincent McMahon"],
            correctAnswer: 3
        },
        {
            question: "Professional wrestler Ric Flair was once manager of the WWEs RAW brand.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "In professional wrestling, the high side thrust kick, often used by Shawn Michaels as a finishing move, is also known by what name?",
            options: ["Batista Bomb", "Leg Drop", "Sweet Chin Music", "5 Star"],
            correctAnswer: 2
        },
        {
            question: "RAW wrestling star Kurt Angle was shaved on stage after a match with Edge in 2002.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Has wrestler Bret Hart been inducted in the WWE Hall of Fame?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "What number did Hank Aaron wear for the Atlanta Braves?",
            options: ["7", "26", "15", "44"],
            correctAnswer: 3
        }
    ],
    'rated': [
        {
            question: "What year did the sensational movie The Departed first hit the theatres in the United States?",
            options: ["2004", "2005", "2007", "2006"],
            correctAnswer: 3
        },
        {
            question: "What city is the movie The Departed set in?",
            options: ["Los Angeles", "Boston", "Chicago", "New York"],
            correctAnswer: 1
        },
        {
            question: "How does Billy Costigan tell Sullivans girlfriend (the criminal psychiatrist) that he is an informant for the Irish mob?",
            options: ["leaves her a note", "sends her a tape/dvd in the mail", "meets her in an alley and divulges the information", "calls her on the phone"],
            correctAnswer: 1
        },
        {
            question: "Who kills Sgt. Colin Sullivan at the end of the movie The Deprated?",
            options: ["Billy Costigan", "Frank Costello", "Capt. George Ellerby", "Staff Sgt. Sean Dignam"],
            correctAnswer: 3
        },
        {
            question: "The last scene in the movie The Departed shows a rodent crawling on Sullivans balcony railing. The rodent appears after Sullivan was shot in the head. What type of rodent was it?",
            options: ["a capybara", "a rat", "a castoroides", "a mouse"],
            correctAnswer: 1
        },
        {
            question: "What year did the sensational movie Rocky first hit the movie theatres?",
            options: ["1977", "1976", "1975", "1978"],
            correctAnswer: 1
        },
        {
            question: "This Emmy Award-winning comedy series was based on the lives of four women living together in Miami Beach, Florida.",
            options: ["Golden Girls", "The Facts of Life", "Maude", "Empty Nest"],
            correctAnswer: 0
        },
        {
            question: "This actor won the Emmy Award for Outstanding Lead Actor in a Comedy Series for his part as the bumbling Jack Tripper in Threes Company.",
            options: ["Richard Mulligan", "John Ritter", "Judd Hirsch", "Alan Alda"],
            correctAnswer: 1
        },
        {
            question: "Michael J. Fox won three consecutive Emmy Awards for Outstanding Actor in a Comedy Series for his role as Alex Keaton in the hit comedy series Family Ties.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "This comedy starring Don Adams won two Emmy Awards for Outstanding Comedy Series in 1968 and 1969.",
            options: ["Mission: Impossible", "Get Smart", "The Fugitive", "Rowan  Martins Laugh-In"],
            correctAnswer: 1
        },
        {
            question: "The 60s pop band The Monkees starred in their own show of the same name and won two Emmy Awards for Outstanding Comedy Series in 1966 and 1967.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Shelley Long and Kirstie Alley both won Emmy Awards for Outstanding Lead Actress in a Comedy Series for this perennial Emmy nominee.",
            options: ["Murphy Brown", "Frasier", "Mad About You", "Cheers"],
            correctAnswer: 3
        },
        {
            question: "Despite its immense popularity during its entire ten-year run, this show won its only Emmy Award for Outstanding Comedy Series in 2002.",
            options: ["Frasier", "Friends", "Will and Grace", "Everybody Loves Raymond"],
            correctAnswer: 1
        },
        {
            question: "What year did the Academy Award-nominated film As Good As It Gets first hit the theatres in the United States?",
            options: ["1999", "1995", "1997", "1998"],
            correctAnswer: 2
        },
        {
            question: "What actor plays the part of the homosexual artist Simon Bishop in the hit movie As Good As It Gets?",
            options: ["Greg Kinnear", "Jack Nicholson", "Cuba Gooding Jr.", "Skeet Ulrich"],
            correctAnswer: 0
        },
        {
            question: "What actor plays the part of Simon Bishops agent and friend, Frank Sachs, in the great movie As Good As It Gets?",
            options: ["Jaheim Hoagland", "Cuba Gooding Sr.", "Abuc Gnidoog", "Cuba Gooding Jr."],
            correctAnswer: 3
        },
        {
            question: "What does Melvin Udall do for a living in the great movie As Good As It Gets?",
            options: ["Writer", "Doctor", "Doorman", "Software Engineer"],
            correctAnswer: 0
        },
        {
            question: "Why does Carol Connelly quit her job as a waitress in the restaurant in the movie As Good As It Gets?",
            options: ["She wants to go to Hawaii but her boss wont give her time off.", "She needed a break from Melvin and his antics.", "to take care of her chronically ill son", "She asked for a raise but didnt get it."],
            correctAnswer: 2
        },
        {
            question: "At the end of the movie As Good As It Gets, Carol and Melvin who start a relationship together are walking somewhere. Where are they going to so early in the morning?",
            options: ["airport", "bakery", "DMV", "diner"],
            correctAnswer: 1
        },
        {
            question: "What year did the movie Major League first hit theaters in the U.S.?",
            options: ["1990", "1989", "1988", "1987"],
            correctAnswer: 1
        },
        {
            question: "What was the name of the team of misfits in the film Major league?",
            options: ["Cleveland Indians", "Los Angeles Dodgers", "New York Mets", "Philadelphia Phillies"],
            correctAnswer: 0
        },
        {
            question: "Willie Mays Hayes was not invited to the teams spring tryouts in the movie Major League.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "In the movie Major League, the team started winning and were asked to do a TV commercial for a credit card company. For which company did they do this commercial that included the line, dont steal home without it, a variation of the companys actual slogan.",
            options: ["Master Card", "Discover", "American Express", "Visa"],
            correctAnswer: 2
        },
        {
            question: "Pedro Cerrano, played by actor Dennis Haysbert in the movie Major League, came to the U.S. as a defector from Cuba. He escaped for the purposes of religious freedom. What was his religion?",
            options: ["Christianity", "Catholicism", "Judaism", "Voodooism"],
            correctAnswer: 3
        },
        {
            question: "At the end of the movie Major League, the team of misfits beats the New York Yankees to win the World Series.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "What year did Monsters, Inc. come out in the movie theatres in the United States?",
            options: ["2002", "2000", "2004", "2001"],
            correctAnswer: 3
        },
        {
            question: "Monsters Inc. was a story set in the town of Minneapolis .",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "What is the name of Mike and Sulleys boss in the great animated feature, Monsters, Inc.?",
            options: ["Randall", "Jerry", "Roz", "Mr. Waternoose"],
            correctAnswer: 3
        },
        {
            question: "In the movie Monsters, Inc., Mike Wazowski takes his girlfriend Celia Mae out to dinner in what type of restaurant?",
            options: ["McDonalds", "Sushi", "Sbarros", "Bulgarian"],
            correctAnswer: 1
        },
        {
            question: "In the movie Monsters, Inc., which actor provided the voice of the mean Randall Boggs?",
            options: ["Steve Buscemi", "George Wendt", "Gilbert Gottfried", "John Ratzenberger"],
            correctAnswer: 0
        },
        {
            question: "What is the name of the scare floor secretary in the animated movie Monsters, Inc.?",
            options: ["Mary", "Scary Mary", "Celia Mae", "Roz"],
            correctAnswer: 3
        },
        {
            question: "In the movie Monsters, Inc., Mr. Waternoose sends both Mike and Sulley to the Himalayas. Who do they stay with while they are there?",
            options: ["Abominable Snowman", "Jack Frost", "Mikes cousin Ike", "Frosty the Snowman"],
            correctAnswer: 0
        },
        {
            question: "At the end of Monsters, Inc., the monsters change their format at the power plant. They realize that instead of scaring children, they can generate more energy for the monster world by doing what?",
            options: ["taking children to the park", "taking children to the movies", "making children laugh", "taking children out for ice cream"],
            correctAnswer: 2
        },
        {
            question: "Most fire engines and fire trucks are this color.",
            options: ["white", "red", "blue", "green"],
            correctAnswer: 1
        },
        {
            question: "This word is the name of a fruit and a color.",
            options: ["orange", "banana", "apple", "pear"],
            correctAnswer: 0
        },
        {
            question: "Water is most often considered this color.",
            options: ["yellow", "orange", "blue", "brown"],
            correctAnswer: 2
        },
        {
            question: "A ready to eat banana is this color.",
            options: ["green", "black", "brown", "yellow"],
            correctAnswer: 3
        },
        {
            question: "Grass under normal weather conditions is this color.",
            options: ["yellow", "green", "tan", "orange"],
            correctAnswer: 1
        },
        {
            question: "What color is Barney the dinosaur from the childrens program?",
            options: ["purple", "white", "yellow", "green"],
            correctAnswer: 0
        },
        {
            question: "Clouds that are not storm clouds are usually this color.",
            options: ["white", "red", "black", "orange"],
            correctAnswer: 0
        },
        {
            question: "Black is the most popular color of dress shoes for men and boys. What is the second most popular color?",
            options: ["brown", "green", "blue", "red"],
            correctAnswer: 0
        },
        {
            question: "This color is usually associated with girls.",
            options: ["brown", "pink", "yellow", "red"],
            correctAnswer: 1
        },
        {
            question: "This color is neither white nor black but somewhere in between.",
            options: ["gray", "brown", "orange", "green"],
            correctAnswer: 0
        },
        {
            question: "What year did the thriller Fatal Attraction first hit the movie theatres in the United States?",
            options: ["1991", "1984", "1987", "1988"],
            correctAnswer: 2
        },
        {
            question: "What does Dan Gallagher do for a living in the hit movie Fatal Attraction?",
            options: ["Mgr. of Home Depot", "Attorney", "Car Salesman", "Tax Preparer"],
            correctAnswer: 1
        },
        {
            question: "How does Dan Gallagher meet Alex Forrest in the great movie Fatal Attraction?",
            options: ["He meets her through work.", "He meets at the supermarket.", "He meets her at the Department of Motor Vehicles.", "He meets her at the gym."],
            correctAnswer: 0
        },
        {
            question: "In the movie Fatal Attraction, what is the name of Alex Forrests favorite opera of all time?",
            options: ["Swan Lake", "The Merry Widow", "Porgy  Bess", "Madame Butterfly"],
            correctAnswer: 3
        },
        {
            question: "In the movie Fatal Attraction, Alex kills Dans daughters pet by boiling it in water. She leaves it on the stove for Dan and the family to see. What kind of pet was it?",
            options: ["Hamster", "Cat", "Fish", "Rabbit"],
            correctAnswer: 3
        },
        {
            question: "In Fatal Attraction, Alex Forrest kidnaps Ellen Gallagher (Dans daughter) from school.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "In the thriller Fatal Attraction, while Beth is in the bathroom, she looks in the mirror and sees a reflection of Alex Forrest. At this point, Alex comes charging towards her with a weapon. What type of weapon is Alex holding in her hand?",
            options: ["gun", "hammer", "axe", "knife"],
            correctAnswer: 3
        }
    ],
    'animals': [
        {
            question: "Three of these animals hibernate. Which one does not?",
            options: ["Snake", "Mouse", "Frog", "Sloth"],
            correctAnswer: 3
        },
        {
            question: "All of these animals are omnivorous except one.",
            options: ["Snail", "Opossum", "Mouse", "Fox"],
            correctAnswer: 0
        },
        {
            question: "Three of these Latin names are names of bears. Which is the odd one?",
            options: ["Helarctos malayanus", "Melursus ursinus", "Ursus minimus", "Felis silvestris catus"],
            correctAnswer: 3
        },
        {
            question: "These are typical Australian animals except one.",
            options: ["Sloth", "Echidna", "Dingo", "Platypus"],
            correctAnswer: 0
        },
        {
            question: "Representatives of three of these species produce venom of their own. Which is the odd species?",
            options: ["Scorpions", "Mosquitos", "Lizards", "Frogs"],
            correctAnswer: 1
        },
        {
            question: "Three of these species shed their skin. Which one does not?",
            options: ["Crustaceans", "Insects", "Snakes", "Penguins"],
            correctAnswer: 3
        },
        {
            question: "All dogs, cats and birds are colorblind.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "All of these animals have large ears (relative to their size) except one.",
            options: ["Polar bears", "Elephants", "Bats", "Foxes"],
            correctAnswer: 0
        },
        {
            question: "This percentage of all snakes on Earth are lethal to humans.",
            options: ["20%", "15%", "25%", "10%"],
            correctAnswer: 1
        },
        {
            question: "Snakes are this kind of animals.",
            options: ["Vegetarian", "Herbivorous", "Omnivorous", "Carnivorous"],
            correctAnswer: 3
        },
        {
            question: "Snakes consume their food by means of this process.",
            options: ["Swallowing", "Absorption", "Breathing", "Chewing"],
            correctAnswer: 0
        },
        {
            question: "Snakes reproduce only by laying eggs.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Snakes are deaf.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Snake skin is covered in scales.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Snakes belong to the following category.",
            options: ["Invertebrates", "Mammals", "Lizards", "Reptiles"],
            correctAnswer: 3
        },
        {
            question: "A specialist in snakes is called one of these.",
            options: ["Herpetologist", "Ophiologist", "Ornithologist", "Pisciculturist"],
            correctAnswer: 1
        },
        {
            question: "One of the following snakes does not belong to the Viperidae family.",
            options: ["Grass snake", "Horned adder", "Asp", "Viper"],
            correctAnswer: 0
        },
        {
            question: "Snakes are very likely to attack us, regardless of whether they feel threatened or not.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "Cobras are venomous snakes of family Elapidae, that generally inhabit regions of these two continents.",
            options: ["Asia and Australia", "South America and Australia", "South America and Asia", "Asia and Africa"],
            correctAnswer: 3
        },
        {
            question: "The cobras most recognizable feature is its hood, a flap of skin and muscle behind the head, believed to serve this purpose.",
            options: ["Camouflage", "More threatening appearance", "Balance control", "Heat collection from sun rays"],
            correctAnswer: 1
        },
        {
            question: "The Cobra is at the top of the food chain, with only two main predators -- one is man and the other is this animal.",
            options: ["Eagle", "Jackal", "Lynx", "Mongoose"],
            correctAnswer: 3
        },
        {
            question: "This is where the Cobras ribs are situated.",
            options: ["In its chest, around the middle of the body", "In its tale", "Behind its head", "Cobras have no ribs"],
            correctAnswer: 2
        },
        {
            question: "The King Cobra feeds almost exclusively on other snakes, even toxic ones.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "A baby cobra is fully able to defend itself in as little as this many hours after being born.",
            options: ["72", "12", "48", "3"],
            correctAnswer: 3
        },
        {
            question: "What type of dog did Richard Nixon receive from a Texan while he was a candidate for Vice President?",
            options: ["Welsh Corgy", "Golden Retriever", "German Shepherd", "Cocker Spaniel"],
            correctAnswer: 3
        },
        {
            question: "What was the name of Socks companion at the White House during the Clinton Administration?",
            options: ["Buddy", "Bailey", "Buster", "Shoes"],
            correctAnswer: 0
        },
        {
            question: "President Fords dog was named Freedom.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Which of these Presidents had the most pets?",
            options: ["Woodrow Wilson", "Franklin Delano Roosevelt", "Theodore Roosevelt", "Bill Clinton"],
            correctAnswer: 2
        },
        {
            question: "What breed is known as the favourite breed of Queen Elizabeth II?",
            options: ["Old English Sheepdog", "Australian Cattle Dog", "Border Collie", "Welsh Corgi"],
            correctAnswer: 3
        },
        {
            question: "What was the name of Fraisers fathers dog on the hit TV show set in Seattle?",
            options: ["Niles", "Marty", "Skip", "Eddie"],
            correctAnswer: 3
        },
        {
            question: "Which one of these sea mammals is not in the endangered species lists?",
            options: ["Pilot whale", "Blue Whale", "Humpback Whale", "Fin Whale"],
            correctAnswer: 0
        },
        {
            question: "This endangered turtle is the biggest of all living turtles, reaching a length of over 2.7 m (8.8 ft) and weight of 900 kg (2,000 lb).",
            options: ["Kemps Ridley Turtle", "Leatherback Sea Turtle", "Mesoamerican River Turtle", "Hawksbill Sea Turtle"],
            correctAnswer: 1
        },
        {
            question: "Name the rarest and most endangered of all wolves.",
            options: ["Ethiopian Wolf", "Gray Wolf", "Black-backed Wolf", "Red Wolf"],
            correctAnswer: 3
        },
        {
            question: "The endangered Komodo dragon is the largest living lizard in the world, growing to an average length of 2-3 meters (10 feet).",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "This species of great apes with long arms and reddish hair suffer habitat destruction due to logging, mining and forest fires.",
            options: ["Gorilla", "Orangutan", "Chimpanzee", "Baboons"],
            correctAnswer: 1
        },
        {
            question: "What is the natural habitat of the snows leopard, that was hunted down for its beautiful fur, as a result of which its population went down to 1,000 animals in the 1960s?",
            options: ["Europe and North America", "Central Asia and North America", "Central Asia", "North America"],
            correctAnswer: 2
        },
        {
            question: "The Asian Elephant, the only living species of the genus Elephas, is the bigger relative of the African Elephant.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "This freshwater mammal, found only in the Yangtze River, is the most endangered (even possibly extinct) cetacean and one of the most endangered species in the world.",
            options: ["Ganges River Dolphin", "Amazon River Dolphin", "Chinese River Dolphin", "La Plata Dolphin"],
            correctAnswer: 2
        },
        {
            question: "This small nocturnal animal, whose natural habitat are the deserts of Northern Africa, is known to jump not only for hunting or protection, but also for pleasure.",
            options: ["Bengal Fox", "Cape Fox", "Red Fox", "Fennec"],
            correctAnswer: 3
        },
        {
            question: "Jack jumper ants, yellowish-orange carnivorous ants named after their characteristic jumpy motions, can be found only on which continent?",
            options: ["North America", "Africa", "Australia", "Asia"],
            correctAnswer: 2
        },
        {
            question: "This small, graceful member of the antelope family is an extraordinary jumper - while leaping, it touches the rocky terrain of its South African habitats only with the tip of its hooves, resembling a dance.",
            options: ["Klipspringer", "Scimitar Oryx", "Oribi", "Roan Antelope"],
            correctAnswer: 0
        },
        {
            question: "Although the jumping viper, a chiefly nocturnal snake, is one of the most powerful jumpers of the snake family, capable of rising up to 1 meter (3 feet) during a strike, its poison is not lethal to humans.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Zoophobia is the fear of animals.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "The hummingbird is the worlds smallest bird.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Which of these animals swims the fastest?",
            options: ["Shark", "Jellyfish", "Dolphin", "Flounder"],
            correctAnswer: 2
        },
        {
            question: "Which word refers to the sound peacocks make?",
            options: ["Squeak", "Scream", "Squill", "Squall"],
            correctAnswer: 1
        },
        {
            question: "Ancient Japanese thought this animal caused earthquakes.",
            options: ["Snakes", "Birds", "Spiders", "Frogs"],
            correctAnswer: 2
        },
        {
            question: "How many types of bats are there?",
            options: ["900", "200", "700", "500"],
            correctAnswer: 0
        },
        {
            question: "Chocolate cannot kill a dog.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "This animal can clean its own ears with its 21-inch tongue.",
            options: ["Elephant", "Lion", "Lizard", "Giraffe"],
            correctAnswer: 3
        }
    ],
    'people': [
        {
            question: "What music video portrays Kylie Minogue lying amongst many men and women by a poolside?",
            options: ["Slow", "On a Night Like This", "Red Blooded Woman", "Chocolate"],
            correctAnswer: 0
        },
        {
            question: "Which statesman uttered these words: âThus, by every device from the stick to the carrot, the emaciated Austrian donkey is made to pull the Nazi barrow up an ever-steepening hillâ?",
            options: ["Franklin D. Roosevelt", "Charles DeGaulle", "Winston Churchill", "Joseph Stalin"],
            correctAnswer: 2
        },
        {
            question: "There is no glory in outstripping donkeysâ was a statement by this Greek Emperor.",
            options: ["Marcus Aurelius", "Tiberius", "Romulus Augustus", "Hadrian"],
            correctAnswer: 0
        },
        {
            question: "Which modern day comedian annoyed his wife with this saying: âI kept giving her donkey ears.â?",
            options: ["Chevy Chase", "Ben Stiller", "Dan Aykroyd", "Adam Sandler"],
            correctAnswer: 0
        },
        {
            question: "This Welsh-born English poet said: If a donkey bray at you, dont bray at himâ.",
            options: ["Waldo Williams", "Bertrand Russell", "George Herbert", "Dylan Thomas"],
            correctAnswer: 2
        },
        {
            question: "âI lived in the US for donkeys years so it has been a journey back in time for me. If you have had personal experience of something, it is always more authentic.â is a quote by this Australian author.",
            options: ["Isobelle Carmody", "Kate Morton", "Melina Marchetta", "Colleen McCullough"],
            correctAnswer: 3
        },
        {
            question: "âIn school nativity plays I was always the bloody little donkey, I was never Mary.â says this singer-songwriter who is also famous as a member of an all female group. Who is she?",
            options: ["Rozonda Chilli Thomas", "Geri Halliwell", "Keren Woodward", "Kelly Rowland"],
            correctAnswer: 1
        },
        {
            question: "âThat which is called firmness in a king is called obstinacy in a donkeyâ is a quote by an American author and educator.",
            options: ["Herbert Kohl", "John Corcoran", "John Erskine", "Jerome Allen"],
            correctAnswer: 2
        },
        {
            question: "âDo you think yourself wise? Then theres a donkey inside your waistcoatâ is a quote from one of the British preacher/theologians of the 19th century.",
            options: ["Hugh Price Hughes", "Borden Parker Bowne", "William Burt Pope", "Charles H. Spurgeon"],
            correctAnswer: 3
        },
        {
            question: "âI do believe the Democratic party has moved far to the right. I do believe that the party has a bunch of elephants running around in donkey clothes.â is a quote by this outstanding American reverend.",
            options: ["Jesse Jackson", "Al Sharpton", "Jeremiah Wright", "Louis Farrakhan"],
            correctAnswer: 1
        },
        {
            question: "âYeah, blindfolds, just like pin the tail on us. Were the donkey.â is a quote from an American lead vocalist and musician of a heavy metal band. Who is he?",
            options: ["Vince Neil", "Rob Halford", "Robert Plant", "Axl Rose"],
            correctAnswer: 0
        },
        {
            question: "âLet him not recite the Veda on horseback, nor on a tree, nor on an elephant, nor in a boat ,or ship , nor on a donkey, nor on camel, nor standing on barren ground, nor riding in a carriage.â was spoken by one of the 11 gurus of India. Which one?",
            options: ["Guru Granth Sahib", "Guru Angad", "Guru Har Gobind", "Guru Nanak"],
            correctAnswer: 3
        },
        {
            question: "After the death of her lover, Cleopatra found true love.  Though Egypt and Rome did not get along,  these two people married in 36 B.C, planning to conquer Rome.",
            options: ["Antony and Cleopatra", "Ptolemy and Cleopatra", "Julius Caesar and Cleopatra", "Octavian and Cleopatra"],
            correctAnswer: 0
        },
        {
            question: "When the ruler of the Mughal Empire married his favorite wife, they were still teenagers. She gave birth to 14 children. After her death  in 1629, the grieving emperor created one of worlds most beautiful edifices - Taj Mahal, paying tribute to his beloved wife.",
            options: ["Alfred Lunt and Lynn Fontanne", "Shah Jahan and Mumtaz Mahal", "Shah Jahan and Raza Devi", "Abelard and Heloise"],
            correctAnswer: 1
        },
        {
            question: "In 1898, three years after their marriage,  this scientific couple  discovered polonium and radium. Thus,  they won the Physics Nobel Prize in 1903 for discovering radioactivity.",
            options: ["Anthony and Cleopatra", "Abigail and John Adams", "Marie and Pierre Curie", "John Alden and Priscilla Mullins"],
            correctAnswer: 2
        },
        {
            question: "The beautiful Egyptian queen was chief wife of an Egyptian Pharaoh in 14th century BC. The couple remained in history as great reformers due to the profound religious changes they made - they introduced the monotheistic worship of the sun disk.",
            options: ["Amenhotep IV and Nefertiti", "Nefertiti and Ay", "Tutankamun and Cleopatra", "Tutankamun and Nefertiti"],
            correctAnswer: 0
        },
        {
            question: "Philosophy brought together this ancient Greek couple.  The wife had a courtesan salon which was frequented by many of the philosophers we now know, but only one of them got to really know her. Noted for her great intellectual power, she gave him inspiration for his work in rhetorics.",
            options: ["Aspasia and Plato", "Aspasia and Plutarch", "Aspasia and Pericles", "Aspasia and Xenophon"],
            correctAnswer: 2
        },
        {
            question: "She was a successful Hollywood actress and he was the president of the USA.  They never managed to be together legally, but their relationship was a public secret.",
            options: ["Marilyn Monroe and Joe DiMagio", "Ava Gardner and Bobby Kennedy", "Ava Gardner and Frank Sinatra", "Marilyn Monroe and John Kennedy"],
            correctAnswer: 3
        },
        {
            question: "Being romantic poets, these two had a really romantic relationship. They knew how to do it, including all the elements a romantic story needs: secret courtship, love poems and everything necessary for their love to thrive.",
            options: ["Charles and Katherine Dickens", "Marie and Pierre Curie", "Sappho and Homer", "Robert and Elizabeth Browning"],
            correctAnswer: 3
        },
        {
            question: "He was a famous French conqueror,  but this wasnt enough for her to accept the marriage proposal immediately. She hesitated at first, but finally agreed.",
            options: ["Alexander the Great and Cleopatra", "Napoleon and Josephine", "Amenhotep and Nefertiti", "Napoleon and Josephine Baker"],
            correctAnswer: 1
        },
        {
            question: "The most famous gangster couple in history, her last name was Parker and he was the anti-authoritarian criminal Barrow.",
            options: ["Bonnie and Clyde", "Cuocolo and Cutinelli", "Lou Jean Poplin and Clovis", "Barre and Lebiez"],
            correctAnswer: 0
        },
        {
            question: "On April 9, 2005 their marriage ended years of speculation on a relationship which has spanned the decades since they first met in 1970.",
            options: ["Catherine Zeta-Jones and Michael Douglas", "Jason Priestley and Naomi Lowde", "Kate Beckingsale and Len Wisemen", "Charles and Camilla"],
            correctAnswer: 3
        },
        {
            question: "Babe Ruths nickname",
            options: ["The Prince of Power", "The Yankee menace", "The Sultan of Swat", "The Crusher from Conrad"],
            correctAnswer: 2
        },
        {
            question: "Red Grange",
            options: ["The Wheatfield Warrior", "The Illini Rocket", "The Galloping Ghost", "Greased Lightning"],
            correctAnswer: 2
        },
        {
            question: "Jerry West",
            options: ["Mr. Gearhead", "Mr. Clutch", "Mr. Fantastic", "Mr. Amazing"],
            correctAnswer: 1
        },
        {
            question: "Edson Arantes Do Nascimento",
            options: ["Barloli Dominguez", "Pele", "Carmingo", "Maradonna"],
            correctAnswer: 1
        },
        {
            question: "Jack Nicklaus",
            options: ["The Golden Bear", "The Golden Buckeye", "The Golden Swing", "The Golden Eagle"],
            correctAnswer: 0
        },
        {
            question: "Rod Laver",
            options: ["The Australian Lion", "Rocket", "Ram", "Booster"],
            correctAnswer: 1
        },
        {
            question: "Joe Namath",
            options: ["White Shoes", "Smooth as Silk", "Broadway Joe", "5th Avenue Joe"],
            correctAnswer: 2
        },
        {
            question: "Willie Mays",
            options: ["The Frisco Phenom", "The Say-Hey Kid", "Fearless", "The Kansas Kid"],
            correctAnswer: 1
        },
        {
            question: "Bobby Hull",
            options: ["The Golden Blackhawk", "The Golden Jet", "The Golden Flash", "The Golden Goose"],
            correctAnswer: 1
        },
        {
            question: "Paavo Nurmi",
            options: ["The Finnish Flash", "The Flying Finn", "The Turko Turbo", "The Turko Wonder"],
            correctAnswer: 1
        },
        {
            question: "Gary Leon Rigway is known as the Green River Killer, responsible for at least 48 murders.  What kind of people did he target?",
            options: ["Schoolboys", "Schoolgirls", "Nurses", "Prostitutes and runaways"],
            correctAnswer: 3
        },
        {
            question: "This serial killer, known as The Ripper of Rostov, roamed Russia in the late 1900s.  He was later found guilty of 52 murders and sentenced to death.",
            options: ["Nikolai Dzhurmongaliev", "Anatoly Onoprieno", "Andrei Chikatilo", "Vadim Yershov"],
            correctAnswer: 2
        },
        {
            question: "The Monster of the Andes, as Pedro Lopez is known, terrorized Ecuador, Peru and Colombia. How many people did he victimize?",
            options: ["More than 300", "More than 200", "More than 100", "More than 50"],
            correctAnswer: 0
        },
        {
            question: "Certainly one of the most dreadful serial killers in US history. Even though he performed as a clown at neghborhood childrens parties, he killed 33 teenagers.",
            options: ["Albert Fish", "Marie Besnard", "Joe Ball", "John Wayne Gacy"],
            correctAnswer: 3
        },
        {
            question: "Bruno Ludke was born in 1909. When he was young, he tortured animals for fun. He strangled or stabbed to death 85 women.  Where was he from?",
            options: ["Germany", "America", "Great Britain", "Russia"],
            correctAnswer: 0
        },
        {
            question: "This serial killer terrorized Washington, Oregon, Colorado, Utah, and Florida. His death sentence was executed in Florida on 24 January 1989.",
            options: ["Juan Corona", "Richard Iceman Kuklinski", "Richard Ramirez", "Ted Bundy"],
            correctAnswer: 3
        },
        {
            question: "This mans rampage lasted from 1979 to 1981. He roamed Atlanta and Georgia, taking the lives of 27 innocent boys. At first the police thought he was a white supremacist, because he targeted black boys, but it turned out he was black himself.  He was caught on 22 May 1981.",
            options: ["Guy Georges", "Kendall Francois", "Robert Berdella", "Wayne Williams"],
            correctAnswer: 3
        },
        {
            question: "This serial killer was known as The Candy Man. His partner,  Wayne Henley, eventually shot him.",
            options: ["Dean Corll", "Abdallah al-Hubal", "Clifford Robert Olson", "Richard Angelo"],
            correctAnswer: 0
        },
        {
            question: "Henry Lee Lucas confessed to more than 500 murders. How many murders was he actually convicted of?",
            options: ["201", "600", "255", "11"],
            correctAnswer: 3
        },
        {
            question: "There are many theories about the identity of this mysterious British serial killer. He marks the dawn of the modern age of serial murders. Although the number of his victims is not high, compared to others on our list (5), he is probably the worlds most famous serial murderer.",
            options: ["The Toledo Clubber", "Jack The Ripper", "Joel Rifkin", "Earl Frederick"],
            correctAnswer: 1
        },
        {
            question: "He disliked Jews and accused them of causing all disasters in German history.",
            options: ["Lenin", "Hitler", "Stalin", "Mussolini"],
            correctAnswer: 1
        },
        {
            question: "He delivered the famous I have a dream speech.",
            options: ["Ho Chi Minh", "Martin Luther King Jr.", "Pope John Paul II", "Mao Zedong"],
            correctAnswer: 1
        },
        {
            question: "She was the only woman to become Prime Minister of Great Britain.",
            options: ["Margaret Thatcher", "Queen Victoria", "Elizabeth Furse", "Diane Julie Abbott"],
            correctAnswer: 0
        },
        {
            question: "He was the only Pope of non-Italian origin since the Dutch-German Pope Adrian VI.",
            options: ["Benedict XVI", "Pope John Paul II", "John Paul I", "Blessed John XXIII"],
            correctAnswer: 1
        },
        {
            question: "He was the only actor to become US President.",
            options: ["Bill Clinton", "Teddy Roosevelt", "Ronald Reagan", "Franklin Delano Roosevelt"],
            correctAnswer: 2
        },
        {
            question: "He was the first democratically-elected President of South Africa.",
            options: ["Mao Zedong", "Nelson Mandela", "Martin Luther King", "Lech Walesa"],
            correctAnswer: 1
        },
        {
            question: "He brought the cause of Indias independence to world attention.",
            options: ["Mohandas Gandhi", "Ho Chi Minh", "Nelson Mandela", "Lech Walesa"],
            correctAnswer: 0
        },
        {
            question: "Which British Prime Minister is considered to have saved his country during WW2?",
            options: ["Winston Churchill", "Edward Churchill", "Neville Chamberlain", "Edward Heath"],
            correctAnswer: 0
        }
    ],
    'history': [
        {
            question: "In which US state is the active Mount Rainier volcano located?",
            options: ["Washington", "New York", "Michigan", "Ohio"],
            correctAnswer: 0
        },
        {
            question: "In 1990, this 5000 year old body was found in the Alps. Scientists discovered some tattoos on his leg which indicated that acupuncture was used as far back as the Copper-stone Age.",
            options: ["Big Foot", "Nessie", "Oetzi", "Sasquatch"],
            correctAnswer: 2
        },
        {
            question: "After unsuccessful  talks about oil production and debt repayment, Iraq occupied Kuwait.  In January 1991 the US launched an air attack against military targets in Iraq and Kuwait in this operation.",
            options: ["Matador", "BOLERO", "Desert Storm", "Determined Force"],
            correctAnswer: 2
        },
        {
            question: "It is the process of producing identical copies of a DNA segment asexually.  In 1996 the first successful one of an animal was made. The animals name was Dolly.  Dolly later died, but Richard Seed announced that he intended try it on humans.",
            options: ["Organ Transplant", "Laser Surgery", "Cloning", "Bloodless Surgery"],
            correctAnswer: 2
        },
        {
            question: "This kind of music became largely popular in Europe and America in the 1990s. It is a melodic, free form combination between techno and house, having hypnotic qualities. The first distinctive track of this kind was Age Of Love, released in 1990.",
            options: ["Techno", "Dance", "Trance", "Electro"],
            correctAnswer: 2
        },
        {
            question: "This womans death was arguably the most shocking one of the decade. She died in 1997 in a car crash while evading paparazzi. The woman was taken to a hospital, but the two-hour efforts of surgeons to save her life were unsuccessful.",
            options: ["Madam C. J. Walker", "Greta Garbo", "Princess Diana", "Nancy Marchand"],
            correctAnswer: 2
        },
        {
            question: "This union, made up of European countries, was established by the Maastricht Treaty in 1992. Starting as a trade body it is now an economic and political partnership between its members.",
            options: ["American Labor Union", "Oxford Union", "The European Union", "European Trade Union"],
            correctAnswer: 2
        },
        {
            question: "Although the first one was sent in 1971, it became widely popular in 1998. Its popularity caused explosive growth of the internet.",
            options: ["The Chat programs", "The E-mail", "The Website", "The URL"],
            correctAnswer: 1
        },
        {
            question: "Impeachment stands for quickly removing dangerously criminal officials from high office. The Impeachment Trial in the Senate for this US President commenced on January 7, 1999.",
            options: ["Ronald Reagan", "George Bush", "Richard Nixon", "Bill Clinton"],
            correctAnswer: 3
        },
        {
            question: "On August 17, 1999 this disaster took the lives of 15 000 and injured 23 000 people in western Turkey.",
            options: ["Volcano eruption", "Tsunami", "Earthquake", "Avalanche"],
            correctAnswer: 2
        },
        {
            question: "These became more advanced and more popular in the 1990, with some of the most influential ones being  the Super Nintendo Entertainment System, the Sony Playstation, and the Sega Dreamcast.",
            options: ["Computer games", "Dating sites", "Video Game consoles", "Virtual reality systems"],
            correctAnswer: 2
        },
        {
            question: "The Punic Wars were a series of three wars fought between these two powers.",
            options: ["Rome and Carthage", "Athens and Sparta", "Rome and Athens", "Carthage and Athens"],
            correctAnswer: 0
        },
        {
            question: "The 1938 incorporation of Austria in Greater Germany under the Nazi Regime is known as this.",
            options: ["Abwer", "Anschluss", "Ahnentafel", "Ansatz"],
            correctAnswer: 1
        },
        {
            question: "Henry Kissinger held this US post from 1974 to 1977.",
            options: ["President of the Senate", "National Security Advisor", "Secretary of State", "Speaker of the House of Representatives"],
            correctAnswer: 2
        },
        {
            question: "One of these cities has been Japans capital in the past.",
            options: ["Hiroshima", "Osaka", "Kyoto", "Yokohama"],
            correctAnswer: 2
        },
        {
            question: "Anne of Austria was the mother of Louis XIV of France (the Sun King).",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Valeria Messalina was the third wife of this Roman emperor.",
            options: ["Nero", "Tiberius", "Caligula", "Claudius"],
            correctAnswer: 3
        },
        {
            question: "Philip II of France, Richard I of England and Frederick I led this campaign.",
            options: ["Childrens Crusade", "Albigensian Crusade", "Fourth Crusade", "Third Crusade"],
            correctAnswer: 3
        },
        {
            question: "Yu the Great was the legendary first Chinese monarch of this dynasty.",
            options: ["Yuan Dynasty", "Xia Dynasty", "Ming Dynasty", "Qing (Manchu) Dynasty"],
            correctAnswer: 1
        },
        {
            question: "This German general was nicknamed The Desert Fox due to the skillful military campaigns he waged in North Africa, during World War II.",
            options: ["Bernard Montgomery", "Erwin Rommel", "George Patton", "Hermann Goring"],
            correctAnswer: 1
        },
        {
            question: "The term Blitzkrieg, referring to swift, sudden military offensive, is translated as Thunder War.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "How many landing beaches were there in the 1944 Normandy Invasion, known as Operation Overlord?",
            options: ["Four", "Five", "Six", "Three"],
            correctAnswer: 1
        },
        {
            question: "What was the name of the first jet-powered fighter used in World War II?",
            options: ["Hurricane", "P-51", "Me-262", "MIG-3"],
            correctAnswer: 2
        },
        {
            question: "Which member of the Nazi Party was known as Adolph Hitlers first architect of the Third Reich?",
            options: ["Rudolph Hess", "Joseph Mengele", "Albert Speer", "Hermann Goring"],
            correctAnswer: 2
        },
        {
            question: "The British evacuation from which French port was codenamed Operation Dynamo, in 1940?",
            options: ["Dunkirk", "Brest", "Toulon", "Cherbourg"],
            correctAnswer: 0
        },
        {
            question: "Which American politician said the following about liberty: They that can give up essential liberty to obtain a little temporary safety deserve neither liberty nor safety.â?",
            options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "Benjamin Franklin"],
            correctAnswer: 3
        },
        {
            question: "Which US President delivered the following words: Ask not what your country can do for you, ask what you can do for your country.?",
            options: ["Abraham Lincoln", "Franklin D. Roosevelt", "John F. Kennedy", "William J. Clinton"],
            correctAnswer: 2
        },
        {
            question: "Which US President said these words: A democracy is nothing more than mob rule, where fifty-one percent of the people may take away the rights of the other forty-nine.?",
            options: ["John F. Kennedy", "Benjamen Franklin", "Thomas Jefferson", "Abraham Lincoln"],
            correctAnswer: 2
        },
        {
            question: "Which US President made the following statement: America stands for liberty, for the pursuit of happiness and for the unalienable right for life. This right to life cannot be granted or denied by government because it does not come from the government, it comes from the creator of life.?",
            options: ["Thomas Jefferson", "John Adams", "George Washington", "George W. Bush"],
            correctAnswer: 3
        },
        {
            question: "These words were spoken by Jed Babbin, a former deputy undersecretary of defence in the first Bush administration, on January 30, 2003: Going to war without France is like going deer hunting without an accordion. You just leave a lot of useless noisy baggage behind.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Which great American leader made the following statement: Any people anywhere, being inclined and having the power, have the right to rise up, and shake off the existing government, and form a new one that suits them better. This is a most valuable - a most sacred right - a right, which we hope and believe, is to liberate the world.â?",
            options: ["Benjamin Franklin", "Thomas Jefferson", "George Washington", "Abraham Lincoln"],
            correctAnswer: 3
        },
        {
            question: "The M1 Carbine is the most mass produced small arm weapon in the United States. Even though it was mainly produced by the Inland Division of General Motors, its design belongs to this famous company.",
            options: ["GIAT Industries", "Winchester", "Magnum Research Inc.", "Kalashnikov"],
            correctAnswer: 1
        },
        {
            question: "How many Medal of Honor citations have been issued during the Vietnam War?",
            options: ["345", "153", "245", "120"],
            correctAnswer: 2
        },
        {
            question: "One of the worlds greatest generals. By  the age of 30 he ruled almost half of the world. This great leader died at the peak of his campaign at the age of 33.  His was taught by Aristotle.",
            options: ["Augustus", "Darius", "Alexander The Great", "Julius Caesar"],
            correctAnswer: 2
        },
        {
            question: "This Carthaginian general marched from Spain to Rome across the Alps.  14,000 of his 40,000 troops died because of the harsh climate.  Later, he won the Battle of Cannae.",
            options: ["Lesius Quietus", "Gaius Marius", "Augustus", "Hannibal"],
            correctAnswer: 3
        },
        {
            question: "His saying, Veni Vidi Vici (I came I saw I conquered) is known all over the world.  His war feats clothed him with glory giving him political power.",
            options: ["Marcus Antonius", "Julius Caesar", "Darius", "Augustus"],
            correctAnswer: 1
        },
        {
            question: "This American general  led the invasion of Normandy.  He was also an American president from 1953 to 1961.",
            options: ["William H. Simpson", "Dwight Eisenhower", "George S. Patton", "MacArthur"],
            correctAnswer: 1
        },
        {
            question: "He was one of the best military officers of Russia during the World War II and involved in the taking of Berlin.",
            options: ["Nicholas Nikolaevich", "Lavr Kornilov", "Alexander Samsonov", "Georgi Zhukov"],
            correctAnswer: 3
        },
        {
            question: "The siege of Leningrad lasted just 1 month.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Along with the French general, this British general also led the campaign in Northern Africa during the World War II.  He was accused of not fighting bravely enough, after his lack of success in Operation Lightfoot.",
            options: ["John White", "Dwight Eisenhower", "Bernard Montgomery", "Georg Stumme"],
            correctAnswer: 2
        },
        {
            question: "This island was Englands first overseas colony.",
            options: ["Greenland", "Newfoundland", "Rhodes", "Iceland"],
            correctAnswer: 1
        },
        {
            question: "In 1962 Jamaica gained full independence from the United Kingdom, but before even becoming a British colony, Jamaica was possession of this country.",
            options: ["Portugal", "Spain", "Italy", "Russia"],
            correctAnswer: 1
        },
        {
            question: "Barbados has never been a British colony.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Australia was officially settled in 1788 as the penal colony of New South Wales. Over the course of the 19th century this many new self-governing Crown Colonies were established on the continent.",
            options: ["4", "12", "5", "3"],
            correctAnswer: 2
        },
        {
            question: "One of  the results of the Second Anglo-Dutch War, between England and the United Netherlands, was that the city of New Amsterdam was renamed to this.",
            options: ["New Mexico", "New York", "New Jersey", "New Orleans"],
            correctAnswer: 1
        },
        {
            question: "Sri Lanka was not considered part of the British Raj.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Slavery was outlawed in all British colonies in this year.",
            options: ["1912", "1812", "1738", "1834"],
            correctAnswer: 3
        },
        {
            question: "On July 1, 1997, the former British colony of Hong Kong reunified with the Peoples Republic of China. This man was the last governor of Hong Kong.",
            options: ["Henry Tang", "Chris Patten", "Tung Chee Hwa", "Donald Tsang"],
            correctAnswer: 1
        },
        {
            question: "Britain was not interested in African territories and thus has never controlled any.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "What was the nickname of Tom Cruises character in Top Gun?",
            options: ["Iceman", "Goose", "Viper", "Maverick"],
            correctAnswer: 3
        }
    ],
    'movies': [
        {
            question: "I would rather be a ghost drifting by your side as a condemned soul than enter heaven without you. Because of your love, I will never be a lonely spirit. (2000)",
            options: ["Crouching Tiger, Hidden Dragon", "Don Juan DeMarco", "Dracula", "Ever After"],
            correctAnswer: 0
        },
        {
            question: "There are only four questions of value in life. What is sacred? Of what is the spirit made of? What is worth living for? What is worth dying for? The answer to each is the same. Only love. (1995)",
            options: ["When Harry Met Sally", "Cant Hardly Wait", "Don Juan DeMarco", "Ten Things I Hate About You"],
            correctAnswer: 2
        },
        {
            question: "I have crossed oceans of time to find you. (1992)",
            options: ["Dracula", "Notting Hill", "Moulin Rouge", "A Knights Tale"],
            correctAnswer: 0
        },
        {
            question: "I came here tonight because when you realize you want to spend the rest of your life with somebody, you want the rest of your life to start as soon as possible. (1989)",
            options: ["The Mask of Zorro", "Youve Got Mail", "Wuthering Heights", "When Harry Met Sally"],
            correctAnswer: 3
        },
        {
            question: "Love has given me wings so I must fly. (2001)",
            options: ["Ever After", "Forget Paris", "A Knights Tale", "Phenomenon"],
            correctAnswer: 2
        },
        {
            question: "Love? Above all things I believe in love! Love is like oxygen! Love is a many splendored thing, love lifts us up where we belong, all you need is love!",
            options: ["Moulin Rouge", "Some Like It Hot", "Hope Floats", "Casablanca"],
            correctAnswer: 0
        },
        {
            question: "It doesnt matter if the guy is perfect or the girl is perfect, as long as they are perfect for each other. (1997)",
            options: ["The Shawshank Redemption", "Good Will Hunting", "Forest Gump", "Citizen Kane"],
            correctAnswer: 1
        },
        {
            question: "I am someone else when Im with you, someone more like myself. (2001)",
            options: ["Original Sin", "Sunrise: A Song of Two Humans", "In America", "Trouble in Paradise"],
            correctAnswer: 0
        },
        {
            question: "If he loved you with all the power of his soul for a whole lifetime, he couldnt love you as much as I do in a single day. (1992)",
            options: ["Romeo and Juliet", "Wuthering Heights", "Sideways", "Shakespeare in Love"],
            correctAnswer: 1
        },
        {
            question: "Take love, multiply it by infinity and take it to the depths of forever and you still have only a glimpse of how I feel for you. (1998)",
            options: ["My Best Friends Wedding", "Message In A Bottle", "Meet Joe Black", "Moulin Rouge"],
            correctAnswer: 2
        },
        {
            question: "One of these James Bond movies was not released during the 80s.",
            options: ["For Your Eyes Only", "Octopussy", "Moonraker", "A View to a Kill"],
            correctAnswer: 2
        },
        {
            question: "This is Babys real name in Dirty Dancing (1987).",
            options: ["Jennifer", "Barbara", "Frances", "Susan"],
            correctAnswer: 2
        },
        {
            question: "In A Nightmare On Elm Street, Nancy lives on Elm Street, located in this fictional city in Ohio.",
            options: ["Derry", "Springwood", "Blackwood County", "Ambervale"],
            correctAnswer: 1
        },
        {
            question: "In the movie Rain Man, Raymond and Charlie are at the restaurant when a waitress drops a box of toothpicks. This prompts Raymond to instantly calculate the number of toothpicks on the floor. This was their number.",
            options: ["321", "123", "246", "250"],
            correctAnswer: 2
        },
        {
            question: "One of these actors did not star in Tootsie.",
            options: ["Teri Garr", "Larry Gelbart", "Dustin Hoffman", "Jessica Lange"],
            correctAnswer: 1
        },
        {
            question: "Axel Foley in Beverly Hills Cop is originally a policeman from this city.",
            options: ["San Fransisco", "Detroit", "Denver", "Chicago"],
            correctAnswer: 1
        },
        {
            question: "Indiana Jones from the movie of the same name could write and speak this number of languages.",
            options: ["2", "6", "27", "11"],
            correctAnswer: 2
        },
        {
            question: "A group of Earth children help a stranded alien botanist return home is the plot outline of this movie.",
            options: ["Star Wars: Episode VI - Return of the Jedi", "Cyborg", "The Hitch Hikers Guide to the Galaxy", "E.T. the Extra-Terrestrial"],
            correctAnswer: 3
        },
        {
            question: "What year did the movie The Shawshank Redemption hit the movie theatres?",
            options: ["1996", "1994", "1990", "1992"],
            correctAnswer: 1
        },
        {
            question: "What was the name of the Warden in the hit movie The Shawshank Redemption ?",
            options: ["Samuel Norton", "Byron Hadley", "Spencer Heywood", "Ellis Redding"],
            correctAnswer: 0
        },
        {
            question: "What decade was Andy Dufresne sent to the Shawshank prison in the movie The Shawshank Redemption?",
            options: ["1920s", "1930s", "1950s", "1940s"],
            correctAnswer: 3
        },
        {
            question: "In the popular movie The Shawshank Redemption Andy Dufresne has a poster hanging on his wall in his jail cell. Who is the famous actress on this poster?",
            options: ["Jayne Mansfield", "Bette Davis", "Rita Hayworth", "Greta Garbo"],
            correctAnswer: 2
        },
        {
            question: "In the movie The Shawshank Redemption Andy Dufresne had a best friend in jail named Red. Why did they call him Red?",
            options: ["He had red hair.", "His favorite color was red.", "It was short for his last name.", "He had a horrible temper."],
            correctAnswer: 2
        },
        {
            question: "Andy Dufresne, the main character in the movie The Shawshank Redemption, asks Captain Byron Hadley for some suds for his fellow workers, while they are working together on the roof. What kind of beer did the prisoners get?",
            options: ["Amstel", "Budweiser", "Heineken", "Strohs"],
            correctAnswer: 3
        },
        {
            question: "Clancy Brown, who played Captain Byron Hadley in The Shawshank Redemption, appeared in a 1983 movie with actor Sean Penn.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "In the movie The Shawshank Redemption, what was Reds jail cell number?",
            options: ["444", "237", "125", "416"],
            correctAnswer: 1
        },
        {
            question: "Does Andy Dufresne escape in the movie The Shawshank Redemption?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "Who was the director of the hit movie The Shawshank Redemption?",
            options: ["Frank Darabont", "Ron Howard", "Rob Reiner", "Shimon  Bentzvi"],
            correctAnswer: 0
        },
        {
            question: "What was the budget for the movie The Shawshank Redemption?",
            options: ["$3,000,000", "$ 25,000,000", "$ 10,000,000", "$ 100,000"],
            correctAnswer: 1
        },
        {
            question: "In the movie The Shawshank Redemption, the prisoners are shown watching what movie?",
            options: ["Its a Mad Mad World", "Happy girl 1223 Strikes Again", "Gilda", "The Three Stooges"],
            correctAnswer: 2
        },
        {
            question: "Who directed the blockbuster movie Forrest Gump?",
            options: ["Robert Zemeckis", "John Hughes", "Steven Soderbergh", "Tony Scott"],
            correctAnswer: 0
        },
        {
            question: "In the opening scene of the movie Forrest Gump, Forrest is sitting on a bench waiting to catch a bus in what southern U.S. city?",
            options: ["Atlanta", "Columbia", "Birmingham", "Savannah"],
            correctAnswer: 3
        },
        {
            question: "Which U.S. president did Forrest NOT get to meet in person in the movie Forrest Gump?",
            options: ["Gerald Ford", "John F. Kennedy", "Lyndon B. Johnson", "Richard M. Nixon"],
            correctAnswer: 0
        },
        {
            question: "In the movie Forrest Gump, Mrs. Gump (played by Sally Field) ran a boarding house where a young Forrest taught one of the special guests how to dance. Who was this special guest?",
            options: ["Elvis Presley", "Fred Astaire", "Dick Van Dyke", "Gene Kelly"],
            correctAnswer: 0
        },
        {
            question: "In the self-titled movie, Forrest Gump appears on the Dick Cavett Show to talk about his visit to China.  Who was the other guest on the Dick Cavett Show sitting next to Forrest, wearing a U.S. Army jacket?",
            options: ["Jane Fonda", "John Lennon", "Abbie Hoffman", "John Wayne"],
            correctAnswer: 1
        },
        {
            question: "In the movie Forrest Gump, Forrest joins the U.S. Army and becomes best friends with Benjamin Buford Blue (played by Mykelti Williamson). What was Benjamins nickname?",
            options: ["Beau", "Bennie", "Billy", "Bubba"],
            correctAnswer: 3
        },
        {
            question: "For which university did fictional character Forrest Gump play college football, earning All-American honors?",
            options: ["Auburn University", "University of Florida", "University of Alabama", "University of Georgia"],
            correctAnswer: 2
        },
        {
            question: "In the movie Forrest Gump, Jenny (played by Robin Wright-Penn) and Forrest were childhood friends. As they got older, Forrest went into the U.S. Army and Jenny became a folk singer at a local strip club, using this stage name.",
            options: ["Abby Hoffman", "Bobbie Dylan", "Mickey Jagger", "Johnnie Cash"],
            correctAnswer: 1
        },
        {
            question: "The famous fictional character Forrest Gump wins the Congressional Medal of Honor by saving most of the men in his squad. Forrest himself is wounded during his heroic rescue. Where is Forrest wounded?",
            options: ["in the stomach", "in the leg", "in the arm", "in the buttocks"],
            correctAnswer: 3
        },
        {
            question: "The Forrest Gump soundtrack was hugely popular, selling over 12 million copies. Which song/artist was not on the Forrest Gump soundtrack?",
            options: ["Break on Through (To the Other Side) by The Doors", "Fortunate Son by CCR", "Satisfaction by The Rolling Stones", "California Dreamin by The Mamas and the Pappas"],
            correctAnswer: 2
        },
        {
            question: "What was Forrests favorite book in the movie Forrest Gump?",
            options: ["Cat in the Hat", "Alice in Wonderland", "Curious George", "The Chronicles of Narnia"],
            correctAnswer: 2
        },
        {
            question: "In the movie Forrest Gump, what were the last words uttered by Pvt. Benjamin Blue to Forrest, just before he died?",
            options: ["Am I going to make it?", "What are we doing here?", "I want my Mama", "I want to go home"],
            correctAnswer: 3
        },
        {
            question: "In the movie Forrest Gump, this actor played Lt. Dan Taylor, the commanding officer of Forrest when he first arrived in Vietnam.",
            options: ["Jack Nicholson", "Gary Sinise", "Ed Harris", "Robert Duvall"],
            correctAnswer: 1
        },
        {
            question: "Which 2001 movie is this audio clip from?",
            options: ["First Knight", "Robin Hood: Prince of Thieves", "A Knights Tale", "Black Knight"],
            correctAnswer: 2
        },
        {
            question: "The movie Back to the Future, directed by Robert Zemeckis, was released in what year?",
            options: ["1987", "1985", "1955", "1986"],
            correctAnswer: 1
        },
        {
            question: "What was the name of Doc Browns dog in the film Back to the Future?",
            options: ["Edsel", "Shaggy", "Einstein", "Shep"],
            correctAnswer: 2
        },
        {
            question: "In the movie Back to the Future, Martys actions in 1955 change the name of the mall where he and Doc meet in 1985, to secretly  test the time machine.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "In the movie Back to the Future, when Marty is in the diner in 1955, he asks for what kind of drink?",
            options: ["All of these", "Pepsi free", "Tab", "something without sugar"],
            correctAnswer: 0
        },
        {
            question: "In Back to the Future, Doc Brown invented this device, which in his words is what makes time travel possible.",
            options: ["transcendental tripometer", "jauntinator", "transference capacitor", "flux capacitor"],
            correctAnswer: 3
        },
        {
            question: "In 1955, Doc Brown, one of the lead characters in Back to the Future lives on which street?",
            options: ["Maplewood Ave", "Riverside Drive", "John F. Kennedy Drive", "Pine St"],
            correctAnswer: 1
        }
    ],
    'brain-teasers': [
        {
            question: "Which of these is true about the sleep of zebras?",
            options: ["All of these", "They need more than 12 hours of sleep a day.", "They sleep standing up.", "They would fall asleep every 5 to 6 hours."],
            correctAnswer: 2
        },
        {
            question: "A farmer had 12 sheep and 3 cows. All of the animals except 9 sheep died. How many animals did he have left in his farm?",
            options: ["none", "2 cows", "9 sheep", "5 cows and 1 sheep"],
            correctAnswer: 2
        },
        {
            question: "I dont speak, I cannot hear, but I always tell the truth.",
            options: ["Fish", "The Mirror", "Old granny", "The watch"],
            correctAnswer: 1
        },
        {
            question: "Can a Roman Catholic man from California marry his widows sister who is from Texas?",
            options: ["Yes", "No"],
            correctAnswer: 1
        },
        {
            question: "How does this proverb continue: The squeaking wheel gets ...",
            options: ["The rust", "The broken", "Removed", "The grease"],
            correctAnswer: 3
        },
        {
            question: "An old man was looking at a photograph of a young man. Somebody asked him who it was. The mans answer was the following: Brothers and sisters, I have none. But that mans father is my fathers son. Who was in the photograph?",
            options: ["His nephew", "His cousin", "His grandfather", "His son"],
            correctAnswer: 3
        },
        {
            question: "A shepherd from a village tended the sheep of those of his fellow villagers who did not tend their own. However, he did not tend the sheep of those villagers who tended their own sheep. In that village, there was only one shepherd and he also had several sheep. Can all this be true?",
            options: ["Yes", "No"],
            correctAnswer: 1
        },
        {
            question: "A famous story begins like that, It was a clear summer day and my family was preparing dinner for the New Years Eve. Can this story be true?",
            options: ["Yes", "No"],
            correctAnswer: 0
        },
        {
            question: "In a basket there are five apples. We give the five apples to five kids so that each kid receives an apple. However, in the basket there is still one apple. Is this possible?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "Two days ago my son was three years old and next year he will be 6.  This could be a correct statement.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "The single difference between the two cities A and B was that the citizens of A always said the truth, while the citizens of B never did. Once, a man who had never been to either city arrived at one of them. Which question should the man have asked in order to identify the city he was in? Have in mind, that people from A often visited their friends in B and vice versa.",
            options: ["Is this city A ?", "Are you a citizen of this city?", "How old are you?", "Are you married?"],
            correctAnswer: 1
        },
        {
            question: "You have two right triangles. The sides of the first one are 3 m, 4 m and 5 m. The sides of the second are 3 m, 4 m and 7 m. The area of the second triangle is bigger.",
            options: ["False", "True"],
            correctAnswer: 0
        },
        {
            question: "What number comes next in the row - 31, 28, 31, 30, ?",
            options: ["29", "30", "31", "32"],
            correctAnswer: 2
        },
        {
            question: "If you were running a race and passed the person in second place, what place would you be in?",
            options: ["Out of the race", "2nd", "1st", "3rd"],
            correctAnswer: 1
        },
        {
            question: "What number comes next: 1, 11, 21, 1211, 111221, 312211, 13112221?",
            options: ["131122211211", "31221113112221", "11221311", "1113213211"],
            correctAnswer: 3
        },
        {
            question: "What is the largest number you can write out with numbers 1, 2, and 3?",
            options: ["10,460,353,203", "123", "321", "6"],
            correctAnswer: 0
        },
        {
            question: "John went to a party one night.  The next day he was asked if he met a lot people at the gathering.  Figure it out for yourself, John said.  Of the girls I spoke to, all but two were blondes, all but two were brunettes, and all but two were redheads.  How many girls did he talk to?",
            options: ["4", "3", "2", "6"],
            correctAnswer: 1
        },
        {
            question: "A kid found two old coins. The first coin said it was minted in 43 BC, while the other said it was minted during the reign of Emperor Nicholas I. Which of the coins was fake?",
            options: ["The one minted in 43 BC", "Both", "The one minted during the reign of Emperor Nicholas I", "Neither one"],
            correctAnswer: 1
        },
        {
            question: "A contestant on a TV show had to answer 26 questions. For each correct answer he received 8 points, while a wrong answer penalized him 5 points. How many answers did the man answer correctly, bearing in mind that he eventually had 0 points?",
            options: ["10", "12", "8", "16"],
            correctAnswer: 0
        },
        {
            question: "Lets suppose that I offer you a bet under the following conditions: I bet $1 and claim that if you give me $5 I will give you $99 in return. Will you gain something from this bet?",
            options: ["Yes", "No"],
            correctAnswer: 1
        },
        {
            question: "You can put something between the digits 2 and 3 so that the resultant number is bigger than 2 and smaller than 3.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "A row consists of 10 letters. The first six are - Z, O, T, T, F, F.  Which is the tenth letter?",
            options: ["N", "T", "E", "S"],
            correctAnswer: 0
        },
        {
            question: "You have a square and a circle and the perimeter of the square is equal to the circumference of the circle. Which of the two figures covers a bigger area?",
            options: ["The square", "The circle", "No conclusion can be drawn from the given information.", "Both cover the same are."],
            correctAnswer: 1
        },
        {
            question: "Sometimes we see 10 but say 22, see 4 but say 16.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "Can you build a house so that all its walls face north?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "At the beginning of the day, I was behind a car at a stoplight, whose vanity plate read: 4SBWIU.  What is the driver of this car most likely a fan of?",
            options: ["NASCAR", "Fly Fishing", "Movies", "Sports"],
            correctAnswer: 2
        },
        {
            question: "My first stop was the supermarket.  When I had completed my shopping and was in the parking lot, I spied this snazzy auto with the following vanity plate: 10S42.  What sport is the driver of this vehicle most likely a fan of?",
            options: ["Bowling", "Golf", "Badminton", "Tennis"],
            correctAnswer: 3
        },
        {
            question: "My next errand took me all the way across town.  I decided to take a shortcut which put me on a boulevard of small, eclectic businesses.  One of these businesses I passed on my way was a fortune tellers shop.  A Cadillac was parked out front, which, I assume, belonged to the owner of the shop. What would be the most appropriate vanity plate for this automobile?",
            options: ["PASS  THE CASH", "N4IT", "N2IT", "N3IT"],
            correctAnswer: 2
        },
        {
            question: "On the on-ramp to the freeway, I was behind an auto with the following plate:  4IS.  What is the likely profession of the driver of this car?",
            options: ["Zoologist", "Geologist", "Optometrist", "Biologist"],
            correctAnswer: 2
        },
        {
            question: "Well, I got caught in noon rush hour.  As luck would have it, I saw yet another vanity plate.  This one told me that the driver at least checks in his / her rear view mirror.  What plate did I see?",
            options: ["OIC3", "OIUC2", "OICU2", "RU2"],
            correctAnswer: 2
        },
        {
            question: "I went to my favorite restaurant to pick up some carry out for an early dinner.  I saw the owners car parked out front. The vanity plate asked a question.  What do you suppose the plate read?",
            options: ["RESORV8NS", "8ISENUF", "E10YET", "N0TABL42"],
            correctAnswer: 2
        },
        {
            question: "I always go up and down the stairs without moving.",
            options: ["A curtain", "A towel", "A rug", "A scarf"],
            correctAnswer: 2
        },
        {
            question: "If the mother of a boy spanks him and then his father comes and does the same, who hurts the most?",
            options: ["The father", "The boys brother", "The boy", "The mother"],
            correctAnswer: 2
        },
        {
            question: "Which letter behaves as a selfish friend?",
            options: ["S", "D", "P", "A"],
            correctAnswer: 2
        },
        {
            question: "You always wear these flowers.",
            options: ["Daises", "Roses", "Poppies", "Tulips"],
            correctAnswer: 3
        },
        {
            question: "12 candles were alight. The wind blew out 5 of them. How many candles were left?",
            options: ["7", "12", "5", "0"],
            correctAnswer: 1
        },
        {
            question: "A team of two horses ran for 3 miles. How many miles did each of the horses run?",
            options: ["0", "1.5", "3", "6"],
            correctAnswer: 2
        },
        {
            question: "Nine passengers carried with them enough food for five days. Several other passengers joined the first group and they all shared the same food, which was now enough for three days. How many passengers joined the first group?",
            options: ["7", "8", "6", "5"],
            correctAnswer: 2
        },
        {
            question: "How many times does the digit 3 occur in the numbers from 1 to 50?",
            options: ["13", "14", "10", "15"],
            correctAnswer: 3
        },
        {
            question: "A pole is 20 m high. An ant is climbing it as follows - every day she ascends 5 m and every night she descends 4 m. In how many days will the ant be on the top of the post?",
            options: ["15", "19", "20", "16"],
            correctAnswer: 3
        },
        {
            question: "A butcher had to stick a total number of 50 sheep in a week. Every day he sticked an equal number of sheep and managed to fulfill the task. How many sheep did he kill per day?",
            options: ["7", "10", "4", "8"],
            correctAnswer: 1
        },
        {
            question: "In a basket there are three sorts of apples. How many apples do you have to  take from the basket to make sure you have at least 2 apples of the same sort?",
            options: ["2", "3", "5", "4"],
            correctAnswer: 3
        },
        {
            question: "An old potter was selling pots. Once, a woman came and bought a pot for its sticker price.  She had to pay $1 plus half its price.  What was the price?",
            options: ["1", "2", "4", "3"],
            correctAnswer: 1
        },
        {
            question: "Four glasses and a jug weigh as mush  as 17 iron balls do. The jug weighs as much as a glass and 7 balls. How many balls does the jug weigh?",
            options: ["8", "9", "10", "5"],
            correctAnswer: 1
        },
        {
            question: "Three cats can eat 3 mice in 1.5 hours. How long will it take 10 cats to eat 20 mice?",
            options: ["3 hours", "1.5 hour", "10 hours", "6 hours"],
            correctAnswer: 0
        },
        {
            question: "Is there a way you can divide 7 identical pieces of bread equally among 12 people?",
            options: ["Yes", "No"],
            correctAnswer: 0
        },
        {
            question: "A lion can eat a sheep in 2 hours, a wolf - in 3 hours, and a dog - in 6 hours. How long will it take the three animals to eat a sheep if they eat together?",
            options: ["8 hours", "1/2 hour", "1 hour", "2 hours"],
            correctAnswer: 2
        },
        {
            question: "Two men were walking towards a river. There was a boat on one of the riverbanks. However, this boat could carry only one man at a time.  Nevertheless, both men managed to cross the river with the boat.  This is possible.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Some of my relatives are 600 times younger than me. Can this be true?",
            options: ["No", "Yes"],
            correctAnswer: 1
        },
        {
            question: "A man is carrying three croquet balls across a bridge. The bridge has a sign that says bridge can only hold 200 pounds. The man weighs 195 pounds and the croquet balls weigh 2 pounds each. The man ends up crossing the bridge in one trip and no one else helps him. This is possible.",
            options: ["True", "False"],
            correctAnswer: 0
        }
    ],
    'geography': [
        {
            question: "What is the capital of Afghanistan?",
            options: ["Tashkent", "Dushanbe", "Kabul", "Tirana"],
            correctAnswer: 2
        },
        {
            question: "What is the capital of Australia?",
            options: ["Ottawa", "Melbourne", "Sydney", "Canberra"],
            correctAnswer: 3
        },
        {
            question: "What is the capital of Belgium?",
            options: ["Brussels", "Stockholm", "Luxemburg", "Amsterdam"],
            correctAnswer: 0
        },
        {
            question: "What is the capital of Greece?",
            options: ["Sofia", "Athens", "Ankara", "Thessaloniki"],
            correctAnswer: 1
        },
        {
            question: "What is the capital of Italy?",
            options: ["Venice", "Naples", "Milan", "Rome"],
            correctAnswer: 3
        },
        {
            question: "What is the capital of Israel?",
            options: ["Jerusalem", "Tel Aviv", "Kabul", "Islamabad"],
            correctAnswer: 0
        },
        {
            question: "What is the capital of Germany?",
            options: ["Frankfurt", "Berlin", "Hamburg", "Munich"],
            correctAnswer: 1
        },
        {
            question: "What is the capital of Norway?",
            options: ["Stockholm", "Copenhagen", "Oslo", "Helsinki"],
            correctAnswer: 2
        },
        {
            question: "What is the capital and largest city of Hawaii, the 50th US state?",
            options: ["Frankfort", "Little Rock", "Dover", "Honolulu"],
            correctAnswer: 3
        },
        {
            question: "When the streams Biya and Katun join in Altai Krai, they form this mighty river. It is located in West Siberia, Russia and has many names- the Siberian Tatars call it Omar or Umar, the Samoyedes- Kolta or Kuay and to the Ostiaks it is known as the As, Yag, Kolta and Yema. It joins the Irtysh river, forming the longest river flow in Russia. What is its name?",
            options: ["Ural", "Volga", "Lena", "Ob"],
            correctAnswer: 3
        },
        {
            question: "Although the Amazon river is generally regarded as the second-longest in the world, it is the river with greatest total flow, carrying more than the Mississippi, Nile, and Yangtze rivers combined.  It ends in the Atlantic Ocean, but it is believed to begin its long journey from this mountain peak.",
            options: ["Mount Chimborazo", "Misti", "Nevado Mismi", "Cotopaxi"],
            correctAnswer: 2
        },
        {
            question: "This is the longest river in Asia and its Chinese name, Chang Jiang, is literally translated to Long River. The critically endangered Chinese River Dolphin and Chinese paddlefish live only in this river. It takes its source in the Qinghai Province, flows for 6,380km (3964miles) and finally empties into the East China Sea. What is the name of this river?",
            options: ["Huai River", "Irtysh", "Mekong", "Yangtze"],
            correctAnswer: 3
        },
        {
            question: "Huang He is the second-longest river in China. Its source is in the Kunlun Mountains at 4,500m (14,764 feet) above sea level. Due to the silts that the river carries, the color of its waters becomes so unnatural that it gave the name of the river . What is the color of the waters of Huang He?",
            options: ["Orange", "Yellow", "Red", "Brown"],
            correctAnswer: 1
        },
        {
            question: "It is the second-longest river in the United States. The longest one, Missouri, joins it to form the longest river flow in North America. This river flows through ten states- Minnesota, Wisconsin, Iowa, Illinois, Missouri, Kentucky, Arkansas, Tennessee, Mississippi and Louisiana and mouths into the Gulf of Mexico. I am not going to ask you about its name, but about its source. What is the origin of the Mississippi river?",
            options: ["Lake Itasca", "Cass Lake", "Lake Superior", "Lake Pepin"],
            correctAnswer: 0
        },
        {
            question: "This is the twelfth-longest river in the world. It runs through China, Myanmar, Thailand, Laos, Cambodia and Vietnam. There are various theories about the source and the exact length of the river because there are several effluents of it that are too difficult to explore. Due to the many rapids and waterfalls, as well as the extreme changes in the flow of the river, sailing is extremely difficult. What is the name of this river?",
            options: ["Mekong", "Brahmaputra", "Angara", "Saskatchewan"],
            correctAnswer: 0
        },
        {
            question: "The longest river in Europe is Volga. But do you know which is the second longest one? It flows through several major European cities, such as Ulm, Vienna, Bratislava, Budapest and Belgrade. The river empties in the Black Sea on the terrirories of Romania and Ukraine.",
            options: ["Don", "Emba", "Dniepr", "Danube"],
            correctAnswer: 3
        },
        {
            question: "The Ganges river is considered to be a holy in India. There is a Hindu legend that the river was created from the sweat of the feet of Vishnu, collected by Brahma. According to Hindu beliefs, if you bathe in the waters of Ganges, it will wash away your sins. However this is not very hygienic, as the river is badly polluted by cremated corpses, carcasses, waste from factories and more.  Where does this river empty?",
            options: ["The Bay of Bengal", "Kara Sea", "Lop Nur", "The Quarry Bay"],
            correctAnswer: 0
        },
        {
            question: "Victoria Falls is one of the most spectacular waterfalls in the world. The falls are named after Queen Victoria by David Livingstone, the explorer who visited them in 1855. The falls are 128 m (420 ft) high and are situated on this river.",
            options: ["Zambezi", "Congo", "Gambia", "Orange"],
            correctAnswer: 0
        },
        {
            question: "The Nile is generally considered the longest river in the world.  The source of this mighty river remained unknown for centuries. Finally Lake Victoria was decided to be its source, although there are other theories. Lake Victoria is located on the territories of these three countries.",
            options: ["Sudan, Ethiopia and Kenya", "Egypt, Morocco and Zimbabwe", "Zambia, Angola and Sudan", "Uganda, Kenya and Tanzania"],
            correctAnswer: 3
        },
        {
            question: "Name the line, which is the same distance from the North Pole and South Pole and runs horizontally around the world.",
            options: ["Tropic of Cancer", "Tropic of Capricorn", "Prime Meridian", "Equator"],
            correctAnswer: 3
        },
        {
            question: "What term refers to the horizontal line, 23.5 degrees S, which passes through South America, Africa, and Australia?",
            options: ["Tropic of Capricorn", "Equator", "Prime Meridian", "Tropic of Cancer"],
            correctAnswer: 0
        },
        {
            question: "Which continents are entirely in the Southern Hemisphere?",
            options: ["South America, Australia and Antarctica", "South America and Australia", "Australia and Antarctica", "South America, Africa, and Australia"],
            correctAnswer: 2
        },
        {
            question: "Which continents (landmasses, not peripheral islands) are entirely in the Northern Hemisphere?",
            options: ["North America and Europe", "North America, Africa, and Asia", "North America, Europe, and Asia", "Europe, Africa and Asia"],
            correctAnswer: 2
        },
        {
            question: "Which continents are entirely in the Western Hemisphere?",
            options: ["Europe, Asia, Africa, Australia", "North America, Europe, and Asia", "North America and South America", "Australia and Antarctica"],
            correctAnswer: 2
        },
        {
            question: "Which feature on a map helps determine direction?",
            options: ["a scale", "a legend", "a compass rose", "a key"],
            correctAnswer: 2
        },
        {
            question: "Which of these is not a type of map projection?",
            options: ["Interrupted", "Crusoe", "Robinson", "Mercator"],
            correctAnswer: 1
        },
        {
            question: "Which of these continents is largest (by territory)?",
            options: ["Europe", "South America", "North America", "Antarctica"],
            correctAnswer: 2
        },
        {
            question: "Which of these countries is smallest (by territory)?",
            options: ["San Marino", "Liechtenstein", "Marshall Islands", "Seychelles"],
            correctAnswer: 0
        },
        {
            question: "Which of these US cities is largest (by population)?",
            options: ["San Antonio", "Houston", "Philadelphia", "Phoenix"],
            correctAnswer: 1
        },
        {
            question: "Which of these mountains is highest?",
            options: ["Mount McKinley", "Mount Kilimanjaro", "Mount Elbrus", "Puncak Jaya"],
            correctAnswer: 0
        },
        {
            question: "Which of these lakes is deepest?",
            options: ["Caspian Sea", "Tanganyika", "Issyk-Kul", "Malawi or Nyasa"],
            correctAnswer: 1
        },
        {
            question: "Which of these rivers is longest?",
            options: ["Amur", "Huang", "Lena", "Ob-Irtysh"],
            correctAnswer: 1
        },
        {
            question: "Which of these seas is largest?",
            options: ["Gulf of Mexico", "Mediterranean", "Arabian Sea", "Bering"],
            correctAnswer: 1
        },
        {
            question: "Which of these deserts is largest?",
            options: ["Syrian", "Chihuahuan", "Thar", "Great Sandy"],
            correctAnswer: 0
        },
        {
            question: "Which of these inhabited places is wettest?",
            options: ["Moulein", "Baguio", "Sylhet", "Lae"],
            correctAnswer: 0
        },
        {
            question: "Which of these oceans has the greatest depth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
            correctAnswer: 2
        },
        {
            question: "The rivers - the Tajo, the Ebro, the Duero, and the Guadiana, are located in this country.",
            options: ["Portugal", "Columbia", "Brazil", "Spain"],
            correctAnswer: 3
        },
        {
            question: "The volcanoes - Akan, Aso, Mount Fuji and Rausu are located in this country.",
            options: ["Japan", "North Korea", "Indonesia", "Malaysia"],
            correctAnswer: 0
        },
        {
            question: "Onega, Khanka and Chudskoye are three of the many lakes in this country.",
            options: ["Kazakhstan", "Russia", "Mongolia", "Ukraine"],
            correctAnswer: 1
        },
        {
            question: "The valleys of the Yellow River and the Pearl River are two of the seven main national valleys in this country.",
            options: ["China", "India", "Burma", "Thailand"],
            correctAnswer: 0
        },
        {
            question: "Pico da Bandeira, Pico do Cruzeiro and Pedra da Mina are three of the numerous mountains located in this South American country.",
            options: ["Brazil", "Chili", "Peru", "Argentina"],
            correctAnswer: 0
        },
        {
            question: "Chauvet Cave and Meyrieres Cave are two caves located in this European state.",
            options: ["Belgium", "Netherlands", "France", "Spain"],
            correctAnswer: 2
        },
        {
            question: "Kainji Lake and Lake Chad are considered lakes of this country.",
            options: ["Nigeria", "Chad", "Niger", "Cameroon"],
            correctAnswer: 0
        },
        {
            question: "Mitchell, Jardine, Staaten, Flinders, Leichhardt, and Nicholson are just few of the rivers in this country.",
            options: ["Australia", "Indonesia", "New Zealand", "Papua New Guinea"],
            correctAnswer: 0
        },
        {
            question: "Kaskaspakte, Akka and Sielmmacohkka are three mountains in this country.",
            options: ["Finland", "Denmark", "Sweden", "Norway"],
            correctAnswer: 2
        },
        {
            question: "Dasht-e Kavir and Kavir-e Lut are deserts located in this Asian country.",
            options: ["Pakistan", "Iraq", "India", "Iran"],
            correctAnswer: 3
        },
        {
            question: "Which two countries border the Dead Sea?",
            options: ["Lebanon and Israel", "Syria and Jordan", "Jordan and Israel", "Lebanon and Jordan"],
            correctAnswer: 2
        },
        {
            question: "Is it true that Yasseir Arafat became chairman of the Palestinian Liberation Organization in 2004?",
            options: ["No", "Yes"],
            correctAnswer: 0
        },
        {
            question: "What are the three Benelux countries?",
            options: ["Finland, Sweden and Denmark", "The U.S.A., Canada and Mexico", "Belgium, Netherlands and Luxembourg", "Honduras, Nicaragua and Belize"],
            correctAnswer: 2
        },
        {
            question: "Did the 13 colonies declare their independence in 1776?",
            options: ["Yes", "No"],
            correctAnswer: 0
        }
    ],
    'science-technology': [
        {
            question: "Immanuel Kant criticized Emanuel Swedenborg and termed him a âspook hunterâ.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "Clouds are made up of these.",
            options: ["Oxygen ions", "Water droplets and ice crystals", "Dust mites", "Carbon atoms"],
            correctAnswer: 1
        },
        {
            question: "This formation is a conical hill or mountain. It is formed by mantle material being pressed through an opening in the Earths crust.",
            options: ["An earthquake", "A hill", "A volcano", "A geyser"],
            correctAnswer: 2
        },
        {
            question: "Japan suffers from this event very often. It is the sudden, light or violent movement of the earths surface caused by the release of energy in the earths crust.",
            options: ["Tide", "Earthquake", "Tsunami", "Volcano"],
            correctAnswer: 1
        },
        {
            question: "It is the only continent that does not have land areas below sea level.",
            options: ["South America", "Arctica", "Antarctica", "Australia"],
            correctAnswer: 2
        },
        {
            question: "It is the longest river in the world",
            options: ["Themes", "The Nile", "The Amazon", "Danube"],
            correctAnswer: 1
        },
        {
            question: "Why do travelers to La Paz, Bolivia, often become ill as soon as they arrive?",
            options: ["Because of the high temperature", "Because of the soil quality", "Because of the altitude", "Because of the humidity"],
            correctAnswer: 2
        },
        {
            question: "In the US, why do we change our clocks on the daylight saving time dates in April and October?",
            options: ["To increase the hours of the day", "To extend the working day", "To conserve energy", "Because the tourist period in most countries starts in May"],
            correctAnswer: 2
        },
        {
            question: "These are places of arid land with really low rainfall and high tempertures variation. Their vegetation is insignificant and the population of people and animals is very limited.",
            options: ["Oceans", "Raiforests", "The equator", "Deserts"],
            correctAnswer: 3
        },
        {
            question: "This is a gemstone made by fossilized tree sap that is at least 30 million years old.",
            options: ["Amber", "Tourmaline", "Obsidian", "Malachite"],
            correctAnswer: 0
        },
        {
            question: "This is the largest island on Earth and one third of it is a national park.",
            options: ["Australia", "Madagaskar", "Greenland", "Alaska"],
            correctAnswer: 2
        },
        {
            question: "Which of these organs has no known function in the human body?",
            options: ["pineal gland", "appendix", "tonsils", "uvula"],
            correctAnswer: 1
        },
        {
            question: "The main function of this organ of respiration is to transport oxygen from the atmosphere into the bloodstream.",
            options: ["diaphragm", "trachea", "stomach", "lung"],
            correctAnswer: 3
        },
        {
            question: "This gland is shaped like a butterfly and helps regulate energy in the body.",
            options: ["parathyroid", "adrenal", "thymus", "thyroid"],
            correctAnswer: 3
        },
        {
            question: "The cerebellum section of the brain controls the fine movement and equilibrium, among other things.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "These organs are very sensitive and often fail in people with very high blood pressure or diabetes.",
            options: ["lungs", "pancreas", "ovaries", "kidneys"],
            correctAnswer: 3
        },
        {
            question: "Tooth enamel is the hardest substance in the body.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "This is one of the first signs of pregnancy.",
            options: ["Hair loss", "Missed period", "Swollen Feet", "Waddling"],
            correctAnswer: 1
        },
        {
            question: "This doctor takes care of you and your baby during pregnancy.",
            options: ["Psychologist", "Obstetrician", "Pediatrician", "Periodontist"],
            correctAnswer: 1
        },
        {
            question: "What is the most common method of child birth?",
            options: ["Cesarean", "In Vitro Fertilization", "Water birth", "Vaginal"],
            correctAnswer: 3
        },
        {
            question: "The mother determines the sex of the baby.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "What are common side effects of pregnancy?",
            options: ["Weight gain", "Morning Sickness", "All of the these", "Stretch marks"],
            correctAnswer: 2
        },
        {
            question: "How far along are you approximately, when you feel the baby move for the first time?",
            options: ["2 weeks", "20 weeks", "35 weeks", "10 weeks"],
            correctAnswer: 1
        },
        {
            question: "What is suggested that you not do several hours before you go into labor?  It could get you embarrassed.",
            options: ["Talk on the phone", "Eat fish", "Have sex", "Eat food"],
            correctAnswer: 3
        },
        {
            question: "What is also delivered along with the baby or immediately after its birth?",
            options: ["Shoulders", "Feet", "Handbook", "Placenta"],
            correctAnswer: 3
        },
        {
            question: "These small bodies are considered left overs from the formation of the Solar system some 4.6 billion years ago.",
            options: ["Comets", "Planets", "Stars", "Asteroids"],
            correctAnswer: 3
        },
        {
            question: "These are lumps of ice and dust.  When they get close enough to the Sun they gradually evaporate.  Jets of gas and dust create long tails that people can see from Earth.",
            options: ["Stars", "Comets", "UFOs", "Asteroids"],
            correctAnswer: 1
        },
        {
            question: "This planet is slightly smaller than Earth and its closest neighbor (excluding the Moon).",
            options: ["Uranus", "Mars", "Venus", "Saturn"],
            correctAnswer: 2
        },
        {
            question: "This planet is has the largest  group of moons - 31, but it is best known for its ring system.",
            options: ["Venus", "Neptune", "Mars", "Saturn"],
            correctAnswer: 3
        },
        {
            question: "This planet of the Solar System was named after a Greek god of the sea and earthquakes. The name is actually the Roman translation of the gods name.",
            options: ["Neptune", "Mercury", "Pluto", "Uranus"],
            correctAnswer: 0
        },
        {
            question: "As this is the closest planet to the Sun, its temperatures at the surface range between -300 and 800 F (hot enough for lead to melt).",
            options: ["Mercury", "Pluto", "Venus", "Neptune"],
            correctAnswer: 0
        },
        {
            question: "The surface of this planet is unique, it is the only one which has water in large quantities.",
            options: ["Mars", "Earth", "Saturn", "Pluto"],
            correctAnswer: 1
        },
        {
            question: "Which Solar System celestial bodys revolution around the Sun takes 248 years?",
            options: ["Saturn", "Neptune", "Pluto", "Uranus"],
            correctAnswer: 2
        },
        {
            question: "This is the largest planet in our solar system. It is most famous for its Great Red Spot.",
            options: ["Neptune", "Mars", "Saturn", "Jupiter"],
            correctAnswer: 3
        },
        {
            question: "Miranda, Ariel, Umbriel, Titania, Oberon, Caliban, and Sycorax are names of the icy moons of this planet.",
            options: ["Jupiter", "Saturn", "Uranus", "Venus"],
            correctAnswer: 2
        },
        {
            question: "The popular chat room abbreviation asl or a/s/l stands for age, sex, and location.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "An icon or animation to represent a participant used in Internet chat and games is referred to as this.",
            options: ["Applet", "Avatar", "Bitmap", "Cookie"],
            correctAnswer: 1
        },
        {
            question: "If you and I are chatting over the Internet and I write LOL, that means that I am doing this.",
            options: ["Laughing", "Eating", "Crying", "Sleeping"],
            correctAnswer: 0
        },
        {
            question: "The terms smiley and emoticon refer to one and the same thing.",
            options: ["False", "True"],
            correctAnswer: 1
        },
        {
            question: "http://www.123facts.com/ is referred to as this.",
            options: ["USB", "WAP", "URL", "TCP"],
            correctAnswer: 2
        },
        {
            question: "One of the following pairs (chat abbreviation - its  meaning) is wrong.",
            options: ["ATM - At The Moment", "TTYL - To Tell You a Lie", "BRB - Be Right Back", "TIA - Thanks In Advance"],
            correctAnswer: 1
        },
        {
            question: "One of these things will not help you to get in touch with your neighbours PC.",
            options: ["Network card", "Hub", "Cache server", "Router"],
            correctAnswer: 2
        },
        {
            question: "If they call me a newbie then I am new to the Internet; and/or new to the subject in general.",
            options: ["True", "False"],
            correctAnswer: 0
        },
        {
            question: "In chat jargon, the emoticon  [8-] refers to this person.",
            options: ["Elvis", "Frankenstein", "The Pope", "Ronald Regan"],
            correctAnswer: 1
        },
        {
            question: "The medical term cardio, deriving from a Greek word, refers to which organ of the human body?",
            options: ["Heart", "Liver", "Brain", "Lungs"],
            correctAnswer: 0
        },
        {
            question: "The term arthro is of Greek origin. It refers to which part of the body?",
            options: ["Bone", "Head", "Joint", "Skin"],
            correctAnswer: 2
        },
        {
            question: "Gastro is a common medical prefix, derived from the Greek word gastros which means what?",
            options: ["Brain", "Cell", "Gas", "Stomach"],
            correctAnswer: 3
        },
        {
            question: "The word hepato, which derives from Greek, refers to the kidney.",
            options: ["True", "False"],
            correctAnswer: 1
        },
        {
            question: "Erythrocytes are a type of blood cells, consisting mainly of hemoglobin. What does the word erythro mean?",
            options: ["Red", "Cell", "Knowledge", "White"],
            correctAnswer: 0
        },
        {
            question: "The term thrombo, which comes from Greek, refers to a blood clot.",
            options: ["True", "False"],
            correctAnswer: 0
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