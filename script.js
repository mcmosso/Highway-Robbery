const canvas = document.getElementById('pixel-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    let animFrame = 0;
    let roadOffset = 0;
    let carPositions = [0, 150, 300, 450, 600, 750, 900];
    let personX = 550;
    let personDir = -1;
    
    function drawPixel(x, y, color, size = 8) {
        ctx.fillStyle = color;
        ctx.fillRect(x * size, y * size, size, size);
    }

    function drawBuildings() {
        const buildings = [
            {x: 5, h: 12}, {x: 18, h: 16}, {x: 31, h: 10},
            {x: 44, h: 14}, {x: 57, h: 11}, {x: 70, h: 15},
            {x: 83, h: 13}, {x: 96, h: 17}, {x: 109, h: 12},
            {x: 122, h: 14}
        ];
        
        buildings.forEach(b => {
            for (let i = 0; i < b.h; i++) {
                for (let j = 0; j < 8; j++) {
                    drawPixel(b.x + j, 20 - i, '#1a1a2e');
                }
            }
            
            for (let i = 2; i < b.h - 1; i += 3) {
                for (let j = 1; j < 7; j += 2) {
                    drawPixel(b.x + j, 20 - i, '#ffc107');
                }
            }
        });
    }
    
    function drawRoad() {
        for (let x = 0; x < 130; x++) {
            for (let y = 20; y < 40; y++) {
                drawPixel(x, y, '#2a2a2a');
            }
        }
        
        for (let i = 0; i < 7; i++) {
            let xPos = (i * 20 + roadOffset) % 130;
            for (let x = 0; x < 10; x++) {
                drawPixel(xPos + x, 29, '#ffc107');
                drawPixel(xPos + x, 30, '#ffc107');
            }
        }
    }
    
    function drawCar(x, y, color) {
        const carData = [
            [0,1,1,1,0],
            [1,1,1,1,1],
            [3,1,1,1,3]
        ];
        const colors = ['', color, '#fff', '#000'];
        carData.forEach((row, dy) => {
            row.forEach((c, dx) => {
                if (c > 0) drawPixel(x + dx, y + dy, colors[c]);
            });
        });
    }
    
    function animate() {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#1a0033');
        grad.addColorStop(0.4, '#2d1b69');
        grad.addColorStop(1, '#4a148c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawBuildings();
        drawRoad();
        
        const carColors = ['#ff1744', '#2196f3', '#ffc107', '#e91e63', '#00e676', '#ff9800', '#9c27b0'];
        carPositions.forEach((pos, i) => {
            drawCar(Math.floor(pos / 6), 27, carColors[i]);
            carPositions[i] = (pos + 2.5) % 1040; 
        });
        roadOffset = (roadOffset + 0.3) % 25;
        animFrame++;
        requestAnimationFrame(animate);
    }
    
    animate();
}
function startCyclingText() {
    const words = ['"choice"', '"freedom"', '"cars"', '"infrastructure"', '"economic history"', '"life"'];
    let currentIndex = 0;
    const element = document.getElementById('cycling-word');
    
    function typeWord(word, callback) {
        let charIndex = 0;
        element.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (charIndex < word.length) {
                element.textContent += word[charIndex];
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(callback, 1500);
            }
        }, 100);
    }
    
    function deleteWord(callback) {
        let currentText = element.textContent;
        
        const deleteInterval = setInterval(() => {
            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                element.textContent = currentText;
            } else {
                clearInterval(deleteInterval);
                setTimeout(callback, 200);
            }
        }, 50);
    }
    
    function cycle() {
        typeWord(words[currentIndex], () => {
            deleteWord(() => {
                currentIndex = (currentIndex + 1) % words.length;
                cycle();
            });
        });
    }
    
    cycle();
}

window.addEventListener('DOMContentLoaded', () => {
    startCyclingText();
});

const gameState = {
    character: {
        firstName: '',
        lastName: '',
        gender: '',
        job: ''
    },
    city: '',
    currentYear: 1950,
    currentGeneration: 1,
    money: 5000,
    monthlySalary: 300,
    monthlyExpenses: 50,
    frustration: 0,
    carsOwned: 0,
    currentScenarioIndex: 0,
    hasCarGen1: false,
    movedToSuburbs: false,
    partnerHasCar: false,
    teenHasCar: false,
    livingWithParents: false,
    livingDowntown: false,
    hasCar: false,
    choiceHistory: []
};

const jobSalaries = {
    factory: 300,   
    teacher: 300,      
    public: 300      
};

const scenarios = {
    detroit: {
        gen1: [
            {   year: 1950,
                title: "Welcome to Detroit",
                narrative: "You just moved to Detroit with $5,000 saved. Your apartment is downtown, walking distance to work. The streetcar stops outside. Your partner works three blocks away. Life feels manageable.",
                image: "images/steetcard.jpg",
                fact: {
                    text: "In 1950, Detroit had one of America's most extensive streetcar systems. A ride cost 10¢.",
                    link: "https://www.detroithistorical.org/learn/online-research/blog/detroits-streetcars-past-and-present"
                },
                choices: [
                    {
                        text: "EXPLORE THE CITY BY STREETCAR EVERY WEEKEND",
                        effects: { money: -100, frustration: -10 },
                        result: "Paradise Valley jazz clubs, Belle Isle picnics, downtown theaters. The streetcar takes you everywhere. You and your partner discover the whole city for pocket change."
                    },
                    {
                        text: "WORK OVERTIME TO SAVE FOR A HOUSE",
                        effects: { money: 200, frustration: 25, jobMultiplier: true },
                        result: "Time and a half pays well. Your savings grow fast but you're exhausted. Your partner barely sees you. Your friends talk about their weekends while you yawn through Monday mornings."
                    },
                    {
                        text: "BALANCE WORK AND LEISURE",
                        effects: { money: 0, frustration: 0 },
                        result: "You work 40 hours. Save a little each month. Friday nights you ride the streetcar to dinner. Sundays you watch the lions (they were really good in the 50s). It's stable and sustainable."
                    }
                ]
            },
            {
                year: 1952,
                title: "Everyone's Buying Cars",
                narrative: "You see cars all over your neighborhood. Your neighbor Frank bought a new Chevy - he's selling his old '48 Plymouth for $700. Everyone at work talks about their weekend drives. Your partner mentions their sister just bought one.",
                image: "images/chrome.jpg",
                choices: [
                    {
                        text: "BUY FRANK'S OLD CAR",
                        effects: { money: -700, monthlyExpenses: 35, frustration: -15, carsOwned: 1 },
                        result: "The Plymouth runs fine. You drive it home Saturday. Sunday drives to visit family in the suburbs. Gas is 20¢/gallon. Parking's free everywhere. You feel like you're living the American Dream. Thanks Frank!",
                        flags: { hasCarGen1: true }
                    },
                    {
                        text: "BUY BRAND NEW ON CREDIT",
                        effects: { money: -1400, monthlyExpenses: 55, frustration: -20, carsOwned: 1 },
                        result: "The salesman shakes your hand like you just joined a club. That new car smell is sooo good. Chrome that shines. Everyone at work notices. The payments are steep but you feel successful.",
                        flags: { hasCarGen1: true }
                    },
                    {
                        text: "STICK WITH STREETCAR",
                        effects: { money: 100, frustration: 15 },
                        result: "Streetcars still run perfectly. You're saving money. But car talk dominates every lunch break. Your partner asks if you've thought about getting one. You're starting to feel left behind."
                    }
                ]
            },
            {
                year: 1954,
                title: "Anniversary Dinner",
                narrative: "Your anniversary is coming up. Your partner wants to go to a new restaurant that opened in the suburbs - everyone's raving about it. It's 9 miles away. The bus takes 90 minutes with two transfers. The streetcar doesn't go there.",
                image: "images/couplead.jpg",
                choices: [
                    {
                        text: "DRIVE THERE",
                        requiresFlag: "hasCarGen1",
                        effects: { money: -15, frustration: -15 },
                        result: "You drive to the restaurant. The food's amazing. Your partner's thrilled. You drive home with the windows down, radio playing. You pass by a Cadillac ad feauturing a happy couple. They remind you of you and your partner. These are the moments that make car ownership feel worth it."
                    },
                    {
                        text: "TAKE THE BUS",
                        requiresNoFlag: "hasCarGen1",
                        effects: { money: -8, frustration: 20 },
                        result: "Two buses, 90 minutes each way. You're exhausted before dinner even starts. The food's good but the travel stress ruined the night. On the way home you see an Cadillac ad featuring a happy couple. Your partner suggests maybe it's time to get a car so you can be like the couple in the ad."
                    },
                    {
                        text: "FIND A DOWNTOWN RESTAURANT INSTEAD",
                        effects: { money: -12, frustration: 10 },
                        result: "You find a nice place downtown you can walk to. It's lovely. But your partner mentions the place they really wanted to try. You see a big Cadillac ad feauturing a happy couple. That could be you one day. You both know the city's already changing."
                    }
                ]
            },
            {
                year: 1955,
                title: "Emergency Room Crisis",
                narrative: "Your partner has appendicitis. The hospital is 15 miles away. It's 2am. The streetcars aren't running this late. Buses have stopped for the night. An ambulance costs $450. You're panicking.",
                requiresNoFlag: "hasCarGen1",
                image: "images/abulance.jpg",
                choices: [
                    {
                        text: "CALL EXPENSIVE AMBULANCE",
                        effects: { money: -450, frustration: 50 },
                        result: "The ambulance arrives in 18 minutes. Your partner is in pain the whole time, yelling and cursing at you. They make it to the hospital. Surgery is successful. But you feel helpless. If you'd had a car, you could've left immediately."
                    },
                    {
                        text: "WAKE A NEIGHBOR TO DRIVE YOU",
                        effects: { money: -20, frustration: 55 },
                        result: "You knock on three doors at 2am before someone finally answers. They're clearly annoyed but agree to drive you to the ER. Your partner's okay. You owe them huge. Being car-free means depending on others in emergencies. Maybe it really is time to get a car."
                    }
                ]
            },
            {
                year: 1956,
                title: "The Last Streetcar",
                narrative: "April 8, 1956. Detroit's final streetcar makes its last run down Woodward Avenue. Crowds gather. Some people cry. The bells ring one last time, then stop forever. You rode these everywhere just a few years ago. Now they're gone. Your backup plan just disappeared.",
                image: "images/lastcar.jpg",
                fact: {
                    text: "Detroit's last streetcar ran on April 8, 1956, ending one of America's largest streetcar systems.",
                    link: "https://www.detroithistorical.org/learn/online-research/blog/detroits-streetcars-past-and-present"
                },
                choices: [
                    {
                        text: "WATCH FROM YOUR CAR",
                        requiresFlag: "hasCarGen1",
                        effects: {frustration: -15 },
                        result: "You watch history end from your driver's seat. People are taking photographs. A kid asks their parent why everyone is sad. You drive home, keys heavy in your pocket. You're glad you bought a car when you did. Fill-up costs $3."
                    },
                    {
                        text: "RIDE THE FINAL STREETCAR",
                        effects: {frustration: 15 },
                        result: "You pack onto the final car with everyone else. People are crying and cheering at the same time, mourning what's being lost. When you step off for the last time, the future feels hostile. The bus system is a skeleton of what the streetcars were.",
                        forceNext: true
                    },
                    {
                        text: "BUY A CAR IMMEDIATELY",
                        requiresNoFlag: "hasCarGen1",
                        effects: { money: -1050, monthlyExpenses: 45, frustration: 20, carsOwned: 1 },
                        result: "The writing's on the wall. Without streetcars, you can't rely on transit anymore. You buy a used car from your neighbor that same week. It's not really a choice - it's survival. Welcome to car dependency.",
                        flags: { hasCarGen1: true }
                    }
                ]
            },
            {
                year: 1956.5,
                title: "You Need a Car Now",
                narrative: "The streetcars are gone. The bus system is inadequate - routes don't connect, schedules are unpredictable. You've been late to work three times this month. Your boss pulled you aside today. You need reliable transportation or you'll lose your job.",
                requiresForced: true,
                choices: [
                    {
                        text: "BUY A CAR (NO CHOICE)",
                        effects: { money: -1050, monthlyExpenses: 45, frustration: 30, carsOwned: 1 },
                        result: "You drain your savings for a used Studebaker. This wasn't a choice. The city eliminated your alternatives and forced you into car ownership. This is what happens when infrastructure disappears. Welcome to the new Detroit.",
                        flags: { hasCarGen1: true },
                        forcedChoice: true
                    }
                ]
            },
                        {
                year: 1959,
                title: "Job Scenario",
                narrative: "",
                image: "",
                choices: []
},
            {
                year: 1962,
                title: "Partner's Job Moves Suburban",
                narrative: "Your partner's department store just opened a huge new suburban location in Southfield. They're transferring your partner there - it's a promotion with better pay. But it's 12 miles away. There's no bus route. You have one car between the two of you. Someone's waking up at 5:30am every morning or you're buying another car.",
                image: "images/mall.jpg",
                choices: [
                    {
                        text: "BUY A SECOND CAR",
                        effects: { money: -1050, monthlyExpenses: 40, frustration: -10, carsOwned: 1 },
                        result: "You're a two-car household now. Two insurance bills, two gas tanks to fill, double the maintenance costs. But you both keep your jobs. Your partner gets the raise. This is what suburban life requires now.",
                        flags: { partnerHasCar: true }
                    },
                    {
                        text: "SHARE ONE CAR",
                        effects: { money: -50, frustration: 40 },
                        result: "You wake up at 5:30am to drive your partner to Southfield, then drive back to your job downtown. Pick them up at 5pm. Your entire life revolves around car logistics now. You're exhausted. This can't last long.",
                        forceNext: true
                    },
                    {
                        text: "PARTNER DECLINES THE PROMOTION",
                        effects: { monthlySalary: -150, frustration: 35 },
                        result: "They turn down the promotion to avoid the car logistics nightmare. Your household income stays lower. You both wonder what could have been. The resentment builds quietly."
                    }
                ]
            },
            {
                year: 1962.5,
                title: "Car Juggling Failed",
                narrative: "Three months of 5:30am wake-ups. You're late to work constantly. Your partner is a passenger seat driver. One day you yelled at them to shut up and now they haven't spoken to you in 2 days. Your boss is annoyed you're always late. You need a second car.",
                requiresForced: true,
                choices: [
                    {
                        text: "BUY A SECOND CAR (NO CHOICE)",
                        effects: { money: -1150, monthlyExpenses: 40, carsOwned: 1 },
                        result: "You have to buy another car. It felt like it was car or divorce. You're a two-car household now whether you planned for it or not. Double the insurance, double the gas, double the maintenance.",
                        flags: { partnerHasCar: true },
                        forcedChoice: true
                    }
                ]
            },
            {
                year: 1964,
                title: "Move to the Suburbs?",
                narrative: "All your friends are moving to the suburbs. Bigger houses, yards, better schools for the kids everyone's having. Your downtown lease is up. Businesses are following people out. The city feels emptier every month. What do you do?",
                image: "images/suburbs.jpg",
                choices: [
                    {
                        text: "MOVE TO BLOOMFIELD HILLS - BIGGER HOUSE",
                        effects: { monthlyExpenses: 500, money: -1000, frustration: 20 },
                        result: "The house is twice the size for less rent. But you're driving everywhere now. Grocery store: 10 minutes. Work: 25 minutes. Hardware store: 15 minutes. Nothing is walkable. Your car becomes your lifeline. The gas bills climb.",
                        flags: { movedToSuburbs: true }
                    },
                    {
                        text: "STAY DOWNTOWN",
                        effects: { money: -200, frustration: 10 },
                        result: "You renew your lease. You can still walk to corner stores and restaurants. But most of your friends are all in the suburbs now. Visiting them requires driving. The city feels emptier every month but sometimes you like the quiet."
                    },
                    {
                        text: "MOVE TO DEARBORN - MIDDLE GROUND",
                        effects: { monthlyExpenses: 300, money: -600, frustration: 15 },
                        result: "Not quite suburbs, not quite city. You drive to work but some stores are still walkable. There's a small yard. The commute is 20 minutes. It's a compromise that works. For now.",
                        flags: { movedToSuburbs: true }
                    }
                ]
            },
            {
                year: 1966,
                title: "Weekend at the Lake",
                narrative: "Your friends are all going to a lake house upstate for the weekend. It's 80 miles away. They're carpooling and there's room for you and your partner. But you'd be completely dependent on their schedule - leave Friday at 5pm sharp, come back Sunday at 3pm sharp. No flexibility at all.",
                image: "images/lakeday.jpg",
                choices: [
                    {
                        text: "DRIVE YOURSELF",
                        effects: { money: -45, frustration: -15 },
                        result: "You drive your own car. Leave when you want. Come back early Sunday if you need to. Stop at roadside diners on the way. Gas costs $25 for the round trip. Freedom feels real. Gas and food on the trip: $45"
                    },
                    {
                        text: "CARPOOL WITH FRIENDS",
                        effects: { money: -15, frustration: 5 },
                        result: "You ride with your friends. You save on gas money. But you're stuck on their exact schedule. You want to leave early Sunday afternoon but you can't. Your friend falls asleep on your shoulder. Next time you'll drive yourself so you have more control."
                    }
                ]
            },
            {
                year: 1968,
                title: "The City Divided",
                narrative: "The past year shook Detroit. But the city was already hollowing out before this. Since 1950, over 180,000 residents have left - white families fleeing to car-accessible suburbs. Freeways destroyed Black Bottom and Paradise Valley, thriving Black neighborhoods. The infrastructure choices were never neutral. They enabled segregation.",
                image: "images/riotdetroit.jpg",
                fact: {
                    text: "From 1950-1960, Detroit lost 179,000 residents. Freeways like I-375 destroyed historically Black neighborhoods including Black Bottom and Paradise Valley.",
                    link: "https://www.detroitnews.com/story/news/local/detroit-city/2021/06/13/black-bottom-paradise-valley-detroits-destroyed-neighborhoods/7481736002/"
                },
                choices: [
                    {
                        text: "STAY IN THE CITY",
                        requiresNoFlag: "movedToSuburbs",
                        effects: {frustration: 25 },
                        result: "You stay downtown. The city needs people who won't abandon it. But businesses keep leaving. Your corner grocery store closes. The hardware store moves out to the suburbs. Everything is getting harder."
                    },
                    {
                        text: "YOU'RE ALREADY IN THE SUBURBS - WATCH THE NEWS",
                        requiresFlag: "movedToSuburbs",
                        effects: {frustration: 10 },
                        result: "You watch the news from your suburban house. You're insulated from the unrest. Your commute gets you away from it all. But you can't help but wonder about the role suburban flight played in all of this. Car maintenance this month: $150."
                    },
                    {
                        text: "MOVE TO THE SUBURBS",
                        requiresNoFlag: "movedToSuburbs",
                        effects: { money: -1000, monthlyExpenses: -40, frustration: 20 },
                        result: "You join the exodus. The suburbs feel safer, newer, more stable. You're part of white flight whether you want to admit it or not. The city hollows out behind you. Moving costs and deposits: $500.",
                        flags: { movedToSuburbs: true }
                    }
                ]
            },
            {
                year: 1970,
                title: "Parking Downtown",
                narrative: "You have a doctor appointment downtown. Parking meters are everywhere now - 25¢ an hour. Or you can pay $2 for a parking garage. Or circle forever looking for free parking. Even owning a car costs money when it's not moving.",
                image: "images/meter.jpg",
                choices: [
                    {
                        text: "PAY FOR THE PARKING GARAGE",
                        effects: { money: -2, frustration: -5 },
                        result: "You pay $2 for the garage. It's easy and your car is safe. But it adds up - every single downtown trip costs money now. Parking meters, parking garages, parking tickets. Your car costs money even when it's sitting still."
                    },
                    {
                        text: "CIRCLE FOR 20 MINUTES HUNTING FOR FREE PARKING",
                        effects: { money: -1, frustration: 15 },
                        result: "You burn a dollar in gas just circling the blocks. You finally find a spot six blocks away from the office. You're late to your appointment and sweaty from the walk. You should have just paid for the garage."
                    },
                    {
                        text: "PARK AT A METER - FEED IT THROUGHOUT THE AFTERNOON",
                        effects: { money: -7, frustration: 25 },
                        result: "You feed quarters into the meter all afternoon. You have to run out in the middle of your appointment to add more coins. You come back to find a $5 parking ticket anyway - the meter expired while you were inside. Total cost: $7."
                    }
                ]
            },
            {
                year: 1973,
                title: "The Gas Crisis",
                narrative: "October 1973. OAPEC oil embargo. Gas prices jump from 36¢ to 53¢ per gallon overnight. Lines wrap around entire blocks. Stations run dry by noon. That freedom machine you bought? Now it's a source of constant anxiety and expense.",
                image: "images/gasline.jpg",
                fact: {
                    text: "The 1973 oil embargo caused gas prices to jump from 36¢ to 53¢ per gallon. Americans waited in hours-long lines as stations ran out of fuel.",
                    link: "https://history.state.gov/milestones/1969-1976/oil-embargo"
                },
                choices: [
                    {
                        text: "WAIT IN GAS LINES(NO CHOICE)",
                        effects: { money: -80, monthlyExpenses: +25, frustration: 50 },
                        result: "You wake up at 6am to try to beat the crowds. You don't beat the crowds. You wait one hour in line for eight gallons of gas. This happens multiple times every month now. Your monthly gas costs have nearly doubled. That 'freedom' you bought back in the '50s doesn't feel so free anymore.",
                        forcedChoice: true
                    }
                ]
            }
        ],
        gen2: [
             {
                    year: 1980,
                    title: "Generation 2 Begins",
                    narrative: "Generation 1 is complete. Now you're playing as your child, all grown up with a family of their own. The infrastructure your parents left you: highways everywhere, transit barely exists, suburbs sprawl for miles. This generation isn't about whether you need a car. It's about how many cars your household needs to function.",
                    image: "",
                    choices: [
                    {
                        text: "Start Generation 2",
                        effects: { monthlySalary: 3000, monthlyExpenses: 1500 },
                        result: "You're starting adult life in the car-designed world your parents built. Time to see what choices you have left."
                    }
        ]
             },
            {
                year: 1980,
                title: "Your First Baby",
                narrative: "Congratulations - you just had your first baby. Pediatrician: 8 miles away in Southfield. Daycare near your job in Troy: 15 miles away. Your parents in Dearborn: 25 miles west. You inherited your parents' old car - it's 20 years old now, no airbags, it sputters at red lights. You're about to strap your newborn baby into it tomorrow morning.",
                image: "images/80scar.jpg",
                choices: [
                    {
                        text: "BUY A NEWER, SAFER CAR FOR YOUR FAMILY",
                        effects: { money: -8000, monthlyExpenses: 500, frustration: -15, carsOwned: 1 },
                        result: "The '79 Buick Regal has airbags and a solid frame. The car seat clicks in perfectly. When the engine purrs to life, you feel like a responsible parent. Monthly costs: payment $140, insurance $90, gas $70. The payments will be steep but your baby deserves safe transportation."
                    },
                    {
                        text: "KEEP THE OLD CAR AND INSTALL A CAR SEAT",
                        effects: { money: -140, monthlyExpenses: 200, frustration: 20 },
                        result: "You strap the car seat into the rust-bucket and pray it holds together. Every weird engine noise makes your stomach drop. Every time someone speeds past you on I-75, you grip the wheel tighter. But you don't want to buy a new car. Sometimes needs outweigh wants."
                    },
                    {
                        text: "BUY A USED CAR",
                        effects: { money: -4500, monthlyExpenses: 300, frustration: 5, carsOwned: 1 },
                        result: "A '76 Ford with 80,000 miles on it. Not perfect, but definitely safer than what you had. It has working brakes and decent tires. Monthly costs: payment $95, insurance $65, gas $45. The baby will probably be fine."
                    }
                ]
            },
            {
                year: 1984,
                title: "Partner's Career Opportunity",
                narrative: "Your partner just got a job offer in Ann Arbor - 45 minutes west of here. Better pay, better benefits, real career advancement. But you work in Troy - 40 minutes east. You have one car between you. Your kid needs daycare drop-off and pickup every single day. The math doesn't work. Someone needs another car, or someone's career is ending.",
                image: "images/annarbor.jpg",
                choices: [
                    {
                        text: "BUY A SECOND CAR SO YOU CAN BOTH WORK",
                        effects: { money: -10000, monthlyExpenses: 520, frustration: -10, carsOwned: 1 },
                        result: "You're a two-car household now. Two car payments totaling $380/mo, two insurance policies at $200/mo, two gas tanks to fill at $150/mo. But you both keep your jobs. You both keep your independence. This is what dual-income car reliance demands.",
                        flags: { partnerHasCar: true }
                    },
                    {
                        text: "PARTNER DECLINES THE JOB - STAY ONE-CAR",
                        effects: {frustration: 35 },
                        result: "They turn down the better opportunity. Your household income stays lower. The resentment is palpable. They look for work closer to home, but the options are limited. Your partner sleeps on the couch for a couple of days.",
                        forceNext: true
                    },
                    {
                        text: "QUIT YOUR JOB - BECOME STAY AT HOME PARENT",
                        effects: { monthlySalary: -1800, frustration: 30 },
                        result: "You give up your career so your partner can take the better job. You become the stay-at-home parent. It wasn't the plan. The isolation is real. Your professional identity feels lost. All of this because of car logistics."
                    }
                ]
            },
            {
                year: 1984.5,
                title: "One Car Doesn't Work",
                narrative: "Three exhausting months of juggling one car. Your partner is arriving late to work constantly. You're missing daycare pickup. Your boss is losing patience. There's no choice left. You need a second car now.",
                requiresForced: true,
                choices: [
                    {
                        text: "BUY A SECOND CAR (NO CHOICE)",
                        effects: { money: -10000, monthlyExpenses: 520, carsOwned: 1 },
                        result: "You and your partner go to the dealership to get another car. Premium this...features in this model features in that model. You just want a car without this whole speech. You're a two-car household now, forced into it whether you planned for it or not. $700/mo just for the cars before you even factor in gas. ",
                        flags: { partnerHasCar: true },
                        forcedChoice: true
                    }
                ]
            },
            {
                year: 1986,
                title: "Reagan Cuts Transit Funding",
                narrative: "The federal government slashes transit funding by 40%. In Detroit, the already-thin bus routes vanish completely. Meanwhile, new highway expansions are being approved and funded. The message is crystal clear: if you don't have a car, you don't matter.",
                image: "images/reagancut.jpg",
                fact: {
                    text: "In 1986, the Reagan administration cut transit funding by 40%. Routes disappeared nationwide while highway funding increased.",
                    link: "https://www.nytimes.com/1986/01/05/us/reagan-seeks-cut-of-40-in-funds-for-mass-transit.html"
                },
                choices: [
                    {
                        text: "THIS DOESN'T AFFECT YOU - YOU HAVE CARS SO YOU DONT CARE",
                        effects: {frustration: -25 },
                        result: "You barely notice the news. Transit was already basically dead here anyway. With your two reliable cars, you're completely insulated from this policy change. Oil changes for both cars this month: $150."
                    },
                    {
                        text: "ATTEND CITY MEETING - SPEAK AGAINST THE CUTS",
                        effects: {frustration: 25 },
                        result: "You actually go to a city council meeting to speak against the cuts. You're one of maybe five people who show up. The council is sympathetic but powerless - this is federal policy. You drive home feeling helpless. Gas and parking cost you $30. Nothing changes."
                    },
                    {
                        text: "DONATE TO A TRANSIT ADVOCACY GROUP",
                        effects: { money: -250, frustration: 10 },
                        result: "You donate $100 to a transit advocacy nonprofit. They send you a thank-you letter. The funding still gets slashed. You did something but it didn't matter. The forces against transit are just too powerful. Car maintenance this month: another $150."
                    }
                ]
            },
            {
                year: 1990,
                title: "Car Breaks Down on the Highway",
                narrative: "Your car completely dies on I-94 during your morning commute. Just dead. The tow truck costs $85. The mechanic's diagnosis: the engine is shot. It needs $2,500 to rebuild, or you can junk it and move on. Your car is 14 years old. What do you do?",
                image: "images/carbreakdkdoown.gif",
                choices: [
                    {
                        text: "REBUILD THE ENGINE - EXTEND THE CAR'S LIFE",
                        effects: { money: -2585, frustration: 40 },
                        result: "Tow plus rebuild costs you $2,585 total. The car runs again but it's still really old. You wonder how long it'll be before the next major breakdown hits. You're throwing good money after bad at this aging vehicle."
                    },
                    {
                        text: "BUY A DIFFERENT USED CAR",
                        effects: { money: -6500, monthlyExpenses: 430, frustration: -5, carsOwned: 1 },
                        result: "You junk the old car and buy an '86 Honda Civic with 95,000 miles on it. Cash price: $5,500, plus the tow was $85. Monthly costs: insurance $90, gas $70. It's a fresh-ish start but it's still a used car. How long will this one last?"
                    },
                    {
                        text: "FINANCE A NEWER CAR",
                        effects: { money: -3085, monthlyExpenses: 560, frustration: -15, carsOwned: 1 },
                        result: "You trade in the dead car for $200 and finance an '88 model that's more reliable. Tow cost $85, down payment $3,000. Monthly: payment $215, insurance $105. It's reliable and you feel better. But the debt cycle never ends."
                    }
                ]
            },
            {
                year: 1992,
                title: "Drive-Through Everything",
                narrative: "Welcome to the future. Drive-through fast food. Drive-through banks. Drive-through pharmacies. You don't have to leave your car for most things anymore. Your 12-year-old kid has never walked to a store alone in their entire life. The world is designed for cars.",
                image: "images/drivein.jpg",
                choices: [
                    {
                        text: "EMBRACE THE CONVENIENCE - IT SAVES TIME",
                        effects: { money: -200, frustration: -30 },
                        result: "Drive-through everything. You barely leave your car all week. It's incredibly efficient. But when your kid asks why you can't just walk to the store like kids do on TV, you don't have a good answer. Monthly drive-through spending: $200."
                    },
                    {
                        text: "TRY TO WALK TO LOCAL STORES",
                        effects: { money: -17, frustration: 25 },
                        result: "You try to walk into town to show your kid it's possible. The sidewalks are cracked. There's no shade anywhere. It's 95 degrees. After a half mile the sidewalk just ends. You never noticed that before. Walking into town isn't even possible. Your kid is ANNOYED. You turn back and take them to the Burger King drive-thru as an apology. 2 whopper meals: $17."
                    },
                    {
                        text: "MIX WALKING AND DRIVING WHEN IT MAKES SENSE",
                        effects: { money: -110, frustration: 5 },
                        result: "You try to walk when it's practical. But it's so rarely practical. The city just wasn't built for walking. Everything is designed for cars. At the mall you decide to walk to the other end instead of moving the car. Baby steps... Money spent at mall: $110."
                    }
                ]
            },
            {
                year: 1996,
                title: "Your Teen Gets Their License",
                narrative: "Your teenager just got their driver's license. They got a job at the mall - 12 miles away with no bus service. All their friends have cars. They're begging you for one. Their high school is 8 miles away. Their soccer practice is 10 miles in a different direction. A car at 16 isn't a luxury anymore - it's absolutely required for participation in anything.",
                image: "images/claire-driving.gif",
                choices: [
                    {
                        text: "BUY THEM A USED CAR",
                        effects: { money: -4500, monthlyExpenses: 350, frustration: -15, carsOwned: 1 },
                        result: "You buy an '89 Honda Civic with 130,000 miles on it. They hug you and immediately drive to their friend's house. You're relieved - no more chauffeur duty - but absolutely terrified watching them back out of the driveway. That's your kid out there in Detroit traffic. Monthly costs: their payment $105, teen insurance rate $180.",
                        flags: { teenHasCar: true }
                    },
                    {
                        text: "DRIVE THEM EVERYWHERE YOURSELF",
                        effects: { money: -150, frustration: 35 },
                        result: "Two months of being their personal chauffeur and you're completely exhausted. Wake up, drive them to school, drive to work, leave work early to get them to their job, pick them up at 9pm, drive home, make dinner, collapse. You're both miserable. Your boss is annoyed you keep leaving early. This is absolutely not sustainable. Extra gas from all the driving: $150/mo.",
                        forceNext: true
                    },
                    {
                        text: "SPLIT THE COST - THEY PAY HALF",
                        effects: { money: -2250, monthlyExpenses: 225, frustration: -5, carsOwned: 1 },
                        result: "They work all summer to save up their half. You match what they saved. The shared ownership makes them drive more carefully and appreciate it more because they earned it. Monthly costs: their payment $60, their insurance $180. You're now a three-car household.",
                        flags: { teenHasCar: true }
                    }
                ]
            },
            {
                year: 1996.5,
                title: "The Driving Schedule Failed",
                narrative: "Three months of being their chauffeur. Your boss is annoyed you keep leaving early. Your teen absolutely resents you controlling their entire schedule. You're completely exhausted. There's no other option anymore. You have to buy them a car.",
                requiresForced: true,
                choices: [
                    {
                        text: "BUY THEM A CAR (NO CHOICE)",
                        effects: { money: -4500, monthlyExpenses: 250, carsOwned: 1 },
                        result: "You scrape together the money and hand them the keys. The relief is immediate. But now you're a three-car household and the insurance bills are absolutely staggering. The American dream is starting to feel more like a financial trap.",
                        flags: { teenHasCar: true },
                        forcedChoice: true
                    }
                ]
            },
            {
                year: 1998,
                title: "The Atlanta Olympics Disaster",
                narrative: "You're taking the family to the Olympics in Atlanta for a once-in-a-lifetime trip. The city promised world-class transit to handle the massive crowds. The reality: packed buses with drivers who don't know the routes, MARTA trains that don't actually connect to the venues, rental cars at triple the normal price. This was supposed to be fun.",
                image: "images/olympics.jpg",
                fact: {
                    text: "The 1996 Atlanta Olympics were an unmitigated transportation disaster. Bus drivers got lost during major events. Athletes arrived late to their own competitions. The IOC demanded changes to prevent another Atlanta.",
                    link: "https://creativeloafing.com/content-214744-atlanta-olympics-were-an-unmitigated-transport"
                },
                choices: [
                    {
                        text: "RENT A CAR AT AN INFLATED PRICE",
                        effects: { money: -500, frustration: 35 },
                        result: "You wait two hours in the rental car line. Parking near the Olympic venues costs $40 each time. You spend more time sitting in Atlanta traffic than actually watching events. This was supposed to be a once-in-a-lifetime family experience. Instead it became a $500 lesson in American transportation failure."
                    },
                    {
                        text: "TRY TO USE MARTA AND HOPE THE TRANSIT WORKS",
                        effects: { money: -30, frustration: 35 },
                        result: "You miss the opening ceremony entirely - the bus just never came. The train was so packed you physically couldn't board. Your kid is crying. Your spouse is furious. You wasted the entire day just trying to get to the venue. You should have just driven."
                    },
                    {
                        text: "SKIP THE OLYMPICS ENTIRELY - LOGISTICS TOO STRESSFUL",
                        effects: {frustration: 50 },
                        result: "You give up on going entirely. The logistics are just too stressful and expensive to figure out. You watch the Olympics on TV instead. Your kid is disappointed. You're disappointed. American transportation infrastructure just failed your family vacation."
                    }
                ]
            },
            {
                year: 2001,
                title: "Your Aging Car Problem",
                narrative: "Your main car is 17 years old now with 190,000 miles on it. You never got it fixed after the fender bender last year. On top of that the mechanic says it's dying - it needs a minimum of $2,200 in work just to keep going. Or you could sell it for maybe $800 and upgrade to something more reliable. You need dependable transportation. Your kids depend on you getting them places.",
                image: "",
                choices: [
                    {
                        text: "POUR MONEY INTO EXPENSIVE REPAIRS",
                        effects: { money: -2200, frustration: 30 },
                        result: "New engine parts, transmission work, all of it. $2,200 completely gone. The car runs better but it's still ancient. You're already wondering when the next big expense is going to hit. You're throwing good money after bad at a dying car."
                    },
                    {
                        text: "BUY A DIFFERENT USED CAR - FRESH START",
                        effects: { money: -5200, monthlyExpenses: 470, frustration: -10, carsOwned: 1 },
                        result: "You sell the old car for $800 and buy a '96 Toyota for $6,400. Title and fees add another $800. Monthly costs: insurance $105, gas $85, payment if financed $140. It's a fresh-ish start but it's still a used car. How long will this one actually last?"
                    },
                    {
                        text: "FINANCE A NEWER CAR - PEACE OF MIND MATTERS",
                        effects: { money: -4800, monthlyExpenses: 860, frustration: -10, carsOwned: 1 },
                        result: "You trade in the dying car for $800 and finance a 2000 model that's actually reliable. Down payment: $4,000. Monthly costs: payment $310, insurance $115. It's reliable and you finally feel some peace of mind. But the debt cycle just never ends."
                    }
                ]
            }
        ],
        gen3: [
            {
                year: 2004,
                title: "Generation 3 Begins",
                narrative: "You just graduated from college with a degree in hand and $35,000 in student loan debt hanging over your head. Your first job offer: $60,000 per year in Detroit. Downtown Detroit is gentrifying and walkable but rent is $1,400/month. The suburbs are way cheaper at $850/month but you'll need to buy a car immediately. Your parents live out in the suburbs and they don't have a spare car sitting around for you.",
                image: "",
                choices: [
                    {
                        text: "Start Generation 3",
                        effects: { monthlySalary: 5800, monthlyExpenses: 2000 },
                        result: "You're 22 years old with a college degree, a mountain of debt, and some big decisions ahead of you. Time to figure out where to live and how you're going to get around in the city your grandparents built."
                    }
            ]
        },
            {
                year: 2004,
                title: "Where Do You Live?",
                narrative: "Your very first real adult decision: where do you actually want to live? Downtown Detroit is gentrifying fast - there are walkable neighborhoods, trendy bars, exposed brick lofts. But the rent is steep. The suburbs are significantly cheaper with way more space, but you'll need to buy a car immediately to function. Your college friends are making completely different choices. What's yours?",
                image: "images/thinking.gif",
                choices: [
                    {
                        text: "MOVE DOWNTOWN",
                        effects: { money: -2800, monthlyExpenses: 700, frustration: 10 },
                        result: "Renovated loft, exposed brick, huge windows. Half your entire paycheck is gone to rent. You can walk to work and walk to bars. No car payment to worry about. But you're eating ramen for dinner every single night. Your suburban friends have space, savings accounts, and cars. You have a good location. First and last month's rent ate $2,800 of your savings.",
                        flags: { livingDowntown: true }
                    },
                    {
                        text: "MOVE TO SUBURBS WITH A CAR",
                        effects: { money: -20000, monthlyExpenses: 630, frustration: 15, carsOwned: 1 },
                        result: "You lease a 2004 Civic and rent an apartment in Royal Oak. Down payment and first month wiped out $3,500 of your savings. Monthly breakdown: rent $850, car payment $350, car insurance $425, gas $115, utilities $190, food and everything else $700. It's a 35-minute commute each way. You have space and some breathing room in your budget. Sort of.",
                        flags: { hasCar: true }
                    },
                    {
                        text: "LIVE WITH YOUR PARENTS",
                        effects: { money: -200, monthlyExpenses: 350, frustration: 35 },
                        result: "You're 22 years old and living in your childhood bedroom again. Your parents are absolutely thrilled. You are decidedly not. You save thousands of dollars per month but you can't bring a date home. You can't host your friends. You can't feel like an actual adult. You keep promising yourself this is just temporary. You're giving your parents $200/month to help with groceries and utilities.",
                        flags: { livingWithParents: true }
                    }
                ]
            },
            {
                year: 2005,
                title: "Your Parents Need Their Cars",
                narrative: "You need to get to work every day. Your parents both use their cars for their own jobs. The bus from their suburb takes 90 minutes each way with two different transfers. You can't keep borrowing their car forever. You need your own transportation, or you need to move out somewhere closer to work. Fast.",
                image: "images/thinking.gif",
                requiresFlag: "livingWithParents",
                choices: [
                    {
                        text: "BUY A USED CAR",
                        effects: { money: -12000, monthlyExpenses: 600, frustration: 30, carsOwned: 1 },
                        result: "You buy a used car with 60,000 miles on it. Down payment eats $3,000 of your savings. Monthly breakdown: car payment $300, insurance $425 (because Detroit rates are brutal), gas $135, food and everything else $700. At least you can reliably get to work now. Living with your parents in the suburbs basically requires having a car.",
                        flags: { hasCar: true }
                    },
                    {
                        text: "MOVE DOWNTOWN",
                        effects: { money: -2800, monthlyExpenses: 2700, frustration: -15 },
                        result: "You find a studio apartment downtown and sign the lease that same day. First month, last month, and security deposit completely wipe out $2,800 of your savings. But now you can walk to work every morning. No car needed. You're broke but you're finally independent.",
                        flags: { livingWithParents: false, livingDowntown: true }
                    }
                ]
            },
            {
                year: 2005,
                title: "The Detroit Insurance Shock",
                narrative: "Your first annual car insurance bill just arrived in the mail: $5,100 for the year. Detroit has the absolute highest car insurance rates in America. It doesn't matter at all that you're a perfectly safe driver with a completely clean record. You live in Detroit, so you pay. This is structural inequality baked directly into the infrastructure.",
                requiresFlag: "hasCar",
                image: "images/insurance.jpg",
                fact: {
                    text: "Detroit consistently has America's highest car insurance rates. In 2005, the average annual rate was $5,162. In 2025, Detroit is still the most expensive city in America for car insurance.",
                    link: "https://www.chicagotribune.com/2005/03/16/car-insurance-expensive-think-5162-in-detroit/"
                },
                choices: [
                    {
                        text: "PAY FOR FULL COVERAGE",
                        effects: { money: -5100, monthlyExpenses: 425, frustration: 40 },
                        result: "That's $425 per month just for insurance alone. You cut your grocery budget. Stop going out to the bar with friends. Stop eating out. Stop contributing to savings. You don't drive recklessly. You don't speed. You just happen to live in the wrong zip code. The system is punishing you for that."
                    },
                    {
                        text: "DROP TO MINIMUM COVERAGE",
                        effects: { money: -2800, monthlyExpenses: 235, frustration: 40 },
                        result: "You switch to the bare minimum legal coverage. If you get in any kind of accident, you're financially destroyed. But you literally cannot afford full coverage AND rent AND student loans AND food all at the same time. The system has forced you into an impossible choice. You drive extra carefully now. Every single day. The rubber of your steering wheel is starting to come off from how hard you've been gripping it."
                    }
                ]
            },
{
    year: 2006,
    title: "Time to go",
    narrative: "You're still living in your childhood bedroom. You tried to bring a date back last week and your mom offered them cookies. THE POKEMON POSTERS ARE STILL UP. Your parents are wonderful but its time to live on your own. You're moving out. The only question is where.",
    image: "images/pokemonroom.jpg",
    requiresFlag: "livingWithParents",
    choices: [
        {
            text: "MOVE DOWNTOWN",
            effects: { money: -2800, monthlyExpenses: 1100, frustration: -30, carsOwned: -1 },
            result: "You find a studio downtown. First, last, security deposit: $2,800 gone. You're broke but finally FREE. No more Pokemon posters. Moving: $2,800.",
            flags: { livingWithParents: false, livingDowntown: true, hasCarGen3: false, soldCarGen3: true }
        }
    ]
},
            {
                year: 2007,
                title: "Your Friend's Suburban Wedding",
                narrative: "Your college friend is getting married out in Novi - about 35 minutes away from downtown. The reception starts at 6pm on a Saturday. You live downtown. An Uber there and back would cost about $110. Or maybe this is finally the moment you should just buy a car and have it for this and literally everything else going forward?",
                requiresFlag: "livingDowntown",
                requiresNoFlag: "hasCar",
                image: "images/suburbanwedding.jpg",
                choices: [
                    {
                        text: "TaAKE A TAXI",
                        effects: { money: -50, frustration: 15 },
                        result: "You taxi there and back for $110 total. The wedding is absolutely beautiful. But literally everyone else drove their own cars. They're all planning to meet up for brunch tomorrow morning in Ann Arbor. You can't justify spending more money on more taxis. You miss the whole after-party gathering."
                    },
                    {
                        text: "CALL YOUR PARENTS AND ASK THEM TO DRIVE YOU",
                        effects: { money: -50, frustration: -5 },
                        result: "Your parents are happy to take you, but you still can't help feeling like a complete burden on them. They fall asleep at 10pm sharp and you end up having to call a taxi to get home from the reception."
                    },
                    {
                        text: "BUY A CAR",
                        effects: { money: -16000, monthlyExpenses: 730, frustration: 20, carsOwned: 1 },
                        result: "This wedding experience made you finally realize: being car-free in Detroit means constantly missing out on things. You buy a used 2005 model. Down payment: $4,500. Monthly breakdown: car payment $335, insurance $425, gas $120, downtown parking garage $250. You're now car-dependent even while living in a supposedly walkable area. The irony is not lost on you.",
                        flags: { hasCar: true }
                    }
                ]
            },
          {
    year: 2008,
    title: "The Auto Industry Collapses - Detroit Dies With It",
    narrative: "The Great Recession hit Detroit like a bomb. GM and Chrysler declare bankruptcy. The auto industry COLLAPSES. Unemployment hits 28%. Your job survives but they cut your salary 15%. Half your friends are packing U-Hauls and fleeing to other cities. The freeways feel empty. The whole city feels like a ghost town. You need to make some hard choices fast.",
    image: "images/crisis.jpg",
    choices: [
        {
            text: "SELL YOUR CAR FOR EMERGENCY CASH",
            requiresFlag: "hasCar",
            effects: { money: 5500, monthlyExpenses: -600, frustration: 40, carsOwned: -1 },
            result: "You sell the car for $5,500 cash. In DETROIT. The irony. You just sold a car in the Motor City during the auto industry collapse. You're taking the bus to work in the city that builds cars. But you need the money more than the vehicle right now. Sold: $5,500.",
            flags: { soldCarGen3: true, hasCar: false }
        },
        {
            text: "DOWNGRADE TO A BEATER",
            requiresFlag: "hasCar",
            effects: { money: 3000, monthlyExpenses: -250, frustration: 10 },
            result: "You sell your decent car for $8,000, and buy a complete piece of shit for $5,000. It's ugly and smells weird but it runs. Insurance drops. Gas drops. You're cutting costs while keeping wheels. Speaking of wheels you're a little worried the wheels on the car are going to fall off at any moment. Net cash: +$3,000."
        },
        {
            text: "MOVE TO CHEAPER NEIGHBORHOOD",
            effects: { money: -1510, monthlyExpenses: -350, frustration: 25 },
            result: "You move from your decent place to somewhere way cheaper and rougher. Rent drops from $850 to $500. The neighborhood is not the best but you're saving $350/month which is MASSIVE during a recession. Sometimes your tap water is brown. Moving and a new Brita: $1,510."
        },
        {
            text: "GET A SIDE HUSTLE",
            effects: { money: 350, monthlyExpenses: -350, frustration: 20 },
            result: "You get a weekend job at a restaurant that's still open. Extra $350/month. You're working 60 hours a week now. You're exhausted. Your social life is dead. But your budget is stable. You get free food too so can't complain too much. Monthly income: +$350."
        },
        {
            text: "ASK YOUR PARENTS FOR A LOAN",
            effects: { money: -20, frustration: 55 },
            result: "You call your parents and ask for help. They're broke too. Phone bill: $20 "
        },
        {
            text: "KEEP EVERYTHING THE SAME",
            effects: { money: -400, frustration: 20 },
            result: "You keep the car, keep the apartment, keep everything exactly the same and just... hope. Your stress builds. Your car needs repairs you can barely afford. You're playing financial chicken with a recession. Emergency expenses: $400."
        }
    ]
},
            {
                year: 2012,
                title: "The Grocery Store Dilemma",
                narrative: "You need to buy groceries every week like everyone else. The corner store near you downtown is walkable and convenient but incredibly expensive. Costco in Madison Heights is 25 minutes away by car with way better bulk prices. Your monthly grocery bill would be $450 at the corner store versus only $300 at Costco. But getting to Costco requires having a car.",
                image: "images/groceries.jpg",
                choices: [
                    {
                        text: "DRIVE TO COSTCO MONTHLY",
                        requiresFlag: "hasCar",
                        effects: { monthlyExpenses: -150, money: -50, frustration: -10 },
                        result: "You drive out to Costco once a month for a big shopping trip. You're saving about $150 per month on groceries compared to the corner store prices. But the gas to get out there costs about $25/month. Plus the annual membership is $50. Your car is enabling you to save money while simultaneously creating total dependency on it. Your trunk isn't even that big - maybe you should get a bigger car?"
                    },
                    {
                        text: "DRIVE TO GREENFIELD MARKET INSTEAD",
                        requiresFlag: "hasCar",
                        effects: { money: -100, frustration: -10 },
                        result: "The market has everything you actually need and the parking lot is pretty easy to navigate. It starts raining on your drive home. Through the window you see someone walking who just dropped their grocery bags all over the wet street. You're really glad you have a car. Monthly grocery costs: $100."
                    },
                    {
                        text: "WALK TO THE GROCERY STORE NEAR YOU",
                        requiresNoFlag: "hasCar",
                        effects: { money: -60, frustration: 5 },
                        result: "You walk to the Whole Foods near your apartment. It's only about a 15-minute walk. You buy way too much because everything looks good. The bags are HEAVY on the walk back. Halfway home it starts pouring rain and the cheap brown paper bags start to completely rip apart. You drop half your groceries right there in the middle of the street."
                    },
                    {
                        text: "GET YOUR GROCERIES DELIVERED EVERY WEEK",
                        requiresNoFlag: "hasCar",
                        effects: { monthlyExpenses: 80, money: -80, frustration: -10 },
                        result: "Grocery delivery is expensive and your delivery driver seems genuinely annoyed that you ordered two full cases of water bottles. Like, who actually needs that much water in single-use plastic bottles?? This doesn't feel sustainable long-term. The monthly delivery fees really add up fast."
                    },
                    {
                        text: "ASK A FRIEND TO DRIVE YOU TO THE STORE",
                        requiresNoFlag: "hasCar",
                        effects: { money: -60, frustration: -10 },
                        result: "You and your friend do a grocery run together, but the whole time you're anxious about how much can actually fit in their car since both of you are buying groceries. This constant low-level anxiety about space causes you to completely forget to buy milk, which was literally the main thing you needed. You feel like such a burden on your friend."
                    }
                ]
            },
            {
                year: 2016,
                title: "Car Maintenance Never Actually Ends",
                narrative: "Your car is 12 years old now. The maintenance is absolutely constant and never-ending. New tires: $600. Complete brake job: $400. New battery: $180. Oil changes throughout the year: $180 total. Annual registration fee: $120. Even when a car is completely paid off, it still costs you money forever and ever.",
                requiresFlag: "hasCar",
                image: "",
                choices: [
                    {
                        text: "PAY FOR ALL THE MAINTENANCE (NO CHOICE)",
                        effects: { money: -2480, frustration: 40 },
                        result: "You pay for everything. You always pay. The car absolutely has to keep running. Each individual expense seems relatively small but when you add them all together they're completely massive. You've easily poured over $200,000 into cars at this point in your life. That's literally a house down payment. That's retirement savings. Instead it all went straight to car companies and gas stations.",
                        forcedChoice: true
                    }
                ]
            },
            {
                year: 2020,
                title: "The Pandemic Hits Detroit",
                narrative: "March 2020. The world shuts down. You're working from home indefinitely. Detroit goes silent. Your transportation needs just changed overnight. What do you do?",
                image: "images/detroitcovid.jpg",
                choices: [
                    {
                        text: "KEEP PAYING FOR YOUR CAR",
                        requiresFlag: "hasCar",
                        effects: { money: -1500, frustration: 10 },
                        result: "You keep paying $600/month for your car. You drive it to Kroger once a week. Sometimes you drive it when you're bored. You're usually bored. You drive around and listen to Blinding Lights by the Weeknd. It keeps you sane. When the world reopens you're glad you kept it. Costs: $1,500."
                     },
        {
            text: "SELL IT",
            requiresFlag: "hasCar",
            effects: { money: 9000, monthlyExpenses: -600, frustration: 20, carsOwned: -1 },
            result: "You sell for $9,000. You're not using it! Feels genius for six months. Then return-to-office starts and used car prices SKYROCKETED 40%. You have to buy another car at insane prices. Huge mistake. Sold: $9,000.",
            flags: { soldCarPandemic: true, hasCar: false }
        },
        {
            text: "DRIVE TO YOUR PARENTS' HOUSE",
            requiresFlag: "hasCar",
            effects: { money: -200, frustration: -15 },
            result: "You load up the car and drive to your parents' suburban house to quarantine there. The car enabled your escape from lockingdown alone. You didn't anticipate how long you would be stuck back with your parents. Your mom is on her third rewatch of Tiger King. Gas and groceries: $200."
        },
        {
            text: "WALK EVERYWHERE, ALL THE TIME",
            requiresNoFlag: "hasCar",
            effects: { money: -150, frustration: -10 },
            result: "You just walk to the store in your mask. Streets are EMPTY. No traffic. Peaceful. You walk up and down the street in your mask. You walk all day. You realize how nice walking is when there aren't so many cars around. You would walk the whole city if you could. Groceries: $150."
        },
        {
            text: "BUY A BIKE",
            requiresNoFlag: "hasCar",
            effects: { money: -200, frustration: -5 },
            result: "You buy a bike to avoid buses and people during COVID lockdown. Biking through ghost-town Detroit is surreal. You see like 3 other people outside. The Motor City is completely empty and you're biking through it. Biking with no cars is so nice and peaceful. Bike: $200."
        },
        {
            text: "PANIC-BUY a CAR TO ESCAPE TO FAMILY",
            requiresNoFlag: "hasCar",
            effects: { money: -15000, monthlyExpenses: 580, frustration: 30, carsOwned: 1 },
            result: "Your friends with cars escaped to better quarantine spots. You panic-buy a car for $15,000 and drive to your parents' place IMMEDIATELY. The pandemic pushed you into car ownership out of pure fear and desperation. Your free to go anywhere, but you don't know where else you would go. You watch all of Outer Banks in one day on your parents couch. What now? Car: $15,000.",
            flags: { hasCar: true }
        },
         {
         text: "Stay with friends",
        requiresNoFlag: "movedToSuburbs",
        effects: {monthlyExpenses: -700, frustration: 20 },
        result: "You move in with two friends to split rent and survive together. Your friend leaves their dirty socks around the apartment. This is fine. Everything's fine. Sometimes you cry in the shower. You've been in the shower too long and now your roomate is banging on the bathroom door."
        },
    ]
},
            {
                year: 2021,
                title: "Return to Office Announced",
                narrative: "Your company just announced return-to-office is happening. You sold your car during the pandemic thinking you were being smart. But used car prices have absolutely exploded - they're up 40% or more from pre-pandemic. That car you sold for $8,000? Now it costs $15,000 to buy something similar. You need reliable transportation to get to work. Ubering every day costs $25 per trip, which adds up to $550 per month. What do you do?",
                requiresFlag: "soldCarPandemic",
                image: "images/backtowork.jpg",
                choices: [
                    {
                        text: "BUY AN OVERPRICED USED CAR",
                        effects: { money: -15000, monthlyExpenses: 750, frustration: 20, carsOwned: 1 },
                        result: "You buy a 2015 model at the inflated pandemic price. Down payment: $5,000. Monthly breakdown: car payment $410, insurance $450 (Detroit!), gas $160, food and other expenses $700. You literally lost money by selling your car and then having to buy another one back at a much higher price. You're completely trapped in the system.",
                        flags: { hasCar: true }
                    },
                    {
                        text: "UBER TO WORK EVERYDAY",
                        effects: { monthlyExpenses: 650, frustration: 25 },
                        result: "You Uber to work every single day. $25 per trip. That's $550 per month, which is almost as much as actually owning a car would cost. Plus there's surge pricing sometimes. Plus you're always waiting for drivers. Plus you're sitting in a stranger's car every morning. This really isn't sustainable long-term but you're avoiding the car ownership trap. For now."
                    },
                    {
                        text: "MOVE WAY CLOSER TO WORK",
                        effects: { money: -3500, monthlyExpenses: 1900, frustration: -15 },
                        result: "You find a new apartment way closer to your office so you can walk. First month, last month, security deposit, moving costs - all of it wipes out $3,500 from your savings. Monthly rent: $1,700. Food and utilities: $900. You can walk to work now. No car needed. But you're completely broke from the moving expenses and the rent is crushing.",
                        flags: { livingDowntown: true }
                    }
                ]
            },
            {
                year: 2022,
                title: "The Weekend Trip Dilemma",
                narrative: "Your friends are planning a weekend trip up to Traverse City. It's a 4-hour drive each way. You're living downtown without a car. They say you can ride with them in their car but you would be completely on their schedule. Leave Friday at 6pm sharp, come back Sunday at 4pm sharp. Zero flexibility whatsoever.",
                requiresFlag: "livingDowntown",
                requiresNoFlag: "hasCar",
                image: "images/traversecity.jpg",
                choices: [
                    {
                        text: "BUY A CAR",
                        effects: { money: -26000, monthlyExpenses: 880, frustration: -15, carsOwned: 1 },
                        result: "You finally buy a 2019 model. Down payment eats $8,000 of your savings. Monthly costs: car payment $510, insurance $450, gas $150, downtown parking garage $270, food and other expenses $900. You completely caved. You're now car-dependent even while living in a supposedly walkable neighborhood. The irony absolutely stings.",
                        flags: { hasCar: true }
                    },
                    {
                        text: "CARPOOL WITH YOUR FRIENDS",
                        effects: { money: -150, frustration: 10 },
                        result: "You ride with your friends and it's mostly fine. But you can't leave when you actually want to. You're stuck completely on their schedule. You really want to stay up there Sunday night but you simply can't because they're leaving at 4pm. Your friend plays Taylor Swift's Midnights the whole way there and back. You like that album but damn they have spotify premium can they seriously not play any other artist? Trip costs for food and activities: $150."
                    },
                    {
                        text: "SKIP THE ENTIRE TRIP - STAY HOME ALONE",
                        effects: { frustration: 50 },
                        result: "You skip the trip entirely. You spend the weekend alone in your apartment while all your friends are bonding up north together. Monday morning they're all sharing inside jokes about things that happened. You weren't there for any of it. Now they have a whole groupchat without you..."
                    }
                ]
            },
            {
                year: 2023,
                title: "Your Best Friend's Boston Wedding",
                narrative: "Your college best friend is getting married in Boston and you desperately want to be there for them. You start looking at your transportation options and reality sets in fast. Flying costs $635 total. Driving would be $400 in gas plus 20 hours of your life behind the wheel. Taking the train would be 22 hours of travel time and $350. This is American transportation in 2023. Literally every single option is terrible.",
                image: "images/boston.jpg",
                choices: [
                    {
                        text: "FLY THERE",
                        effects: { money: -635, frustration: 10 },
                        result: "You fly. The flight is delayed by three hours. You miss your connection. You land in Boston completely exhausted and stressed out. You're worried about making your return flight on time Sunday. The wedding itself is absolutely beautiful but you're completely drained from all the travel stress. This should have been a joyful celebration."
                    },
                    {
                        text: "DRIVE THERE",
                        requiresFlag: "hasCar",
                        effects: { money: -400, frustration: 25 },
                        result: "You drive ten hours straight through Ohio, Pennsylvania, and New York. Your back is killing you. You're completely exhausted when you finally arrive. Friday is just driving. Sunday is just driving. You took two precious days off work and you spent literally half of them sitting behind a steering wheel on highways."
                    },
                    {
                        text: "SKIP THE WEDDING ENTIRELY - CAN'T JUSTIFY THE COSTS",
                        effects: { money: -150, frustration: 65 },
                        result: "You just can't justify the cost, the time commitment, or the absolute hassle of getting there. You send a generous gift and a deeply apologetic text message. What kind of person skips their best friends weddind?"
                    }
                ]
            },
            {
                year: 2024,
                title: "First Date Geography Problem",
                narrative: "You matched with someone on Hinge. The conversation has been genuinely great. Real chemistry happening. They suggest grabbing drinks at this bar in Ferndale - about 25 minutes away in normal traffic conditions. But it's Friday night, which realistically means 40+ minutes each way through rush hour. You're excited about meeting them but you're also completely exhausted from your work week. What do you do?",
                image: "images/hinge.gif",
                choices: [
                    {
                        text: "GO ON THE DATE - THEY SEEM WORTH THE DRIVE",
                        requiresFlag: "hasCar",
                        effects: { money: -75, frustration: -10 },
                        result: "The date is genuinely great. They're funny and interesting and very attractive. But you spent 2 full hours driving for what ended up being a 90-minute date. When they text you the next day suggesting date number two in Ann Arbor (which is 45 minutes away), you hesitate. Geographic distance is starting to feel like a legitimate relationship barrier before this has even really started."
                    },
                    {
                        text: "TAKE AN UBER THERE",
                        requiresNoFlag: "hasCar",
                        effects: { money: -95, frustration: 10 },
                        result: "You Uber there and back for $95 total. The date itself is genuinely good but it's getting expensive to date without a car. They have a car and keep suggesting these very car-dependent date ideas. You keep having to Uber everywhere. This is getting expensive incredibly fast and it's not sustainable."
                    },
                    {
                        text: "SUGGEST MEETING SOMEWHERE WAY CLOSER TO YOU",
                        effects: { frustration: 10 },
                        result: "You suggest a bar that's actually near you instead. They say that doesn't really work for them - it's 45 minutes from their place. You both live in the same metro area but you're completely geographically incompatible. The conversation just kind of fizzles out after that. Another potential romantic connection killed by distance and car dependency."
                    },
                    {
                        text: "CANCEL THE DATE - YOU'RE JUST TOO TIRED TO DRIVE",
                        effects: { frustration: 50 },
                        result: "You make up some excuse and cancel on them. You're simply too exhausted to drive an hour round trip after your long work week. You order takeout and watch Netflix completely alone instead. Car dependency adds friction to absolutely everything. Spontaneity dies. Dating dies. Community dies. You just stay home."
                    }
                ]
            },
            {
                year: 2025,
                title: "The Final Reckoning",
                narrative: "You're 43 years old now. You've been driving for 21 years. Time to actually sit down and add up what car ownership has cost you. What did 75 years of American car dependency actually mean?",
                image: "",
                choices: [
                    {
                        text: "SEE HOW YOUR STORY ENDED",
                        effects: {},
                        result: "Your journey through 75 years of American car dependency is complete. Time to see what it all actually meant."
                     }
                    ]
            }
        ]
    }
};
const jobSpecificScenarios = {
    factory: {
        year: 1959,
        title: "The Factory Moves",
        narrative: "Management drops the news during lunch: the factory's relocating to Warren next year. Cheaper land, room to expand, easier truck access. It's 15 miles north. No streetcar goes there. The bus takes two hours with three transfers. You either buy a car to keep this job, move to Warren and need a car anyway, or start hunting for factory work in a city that's hemorrhaging manufacturing jobs.",
        image: "factorywarren.jpg",
        choices: [
            {
                text: "BUY A CAR TO KEEP YOUR JOB",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1200, monthlyExpenses: 55, frustration: 20, carsOwned: 1 },
                result: "You buy a used car before the move happens. When the factory relocates, your commute becomes 35 minutes of driving each way. At least you kept your paycheck and your overtime. Half your coworkers without cars got laid off. This is how they force you into car ownership.",
                flags: { hasCarGen1: true }
            },
            {
                text: "YOU ALREADY HAVE A CAR - DODGE THIS CRISIS",
                requiresFlag: "hasCarGen1",
                effects: { money: -65, frustration: 15 },
                result: "Your commute doubles overnight but you kept your job. Gas costs jump. The guys who relied on streetcars are scrambling or getting laid off. You got lucky buying a car when you did. Extra gas: $65/month."
            },
            {
                text: "MOVE TO WARREN - FOLLOW THE WORK",
                effects: { money: -750, monthlyExpenses: 35, frustration: 25 },
                result: "You find a place near the new factory. Rent's cheaper but now you need a car for everything. Corner store? Car. Doctor? Car. You became car-dependent just by following your factory job. Moving costs: $750.",
                flags: { movedToSuburbs: true }
            }
        ]
    },
    teacher: {
        year: 1959,
        title: "School District Restructuring",
        narrative: "The Detroit school board is consolidating. Your school in the city is overcrowded and underfunded. They're offering transfers to brand new schools in Dearborn and Southfield - modern facilities, better resources, massive parking lots because teachers will need cars. Your current school is walkable from your apartment. The new ones are 10-14 miles away. This basically determines your whole teaching career.",
        image: "images/classroom2.jpg",
        choices: [
            {
                text: "TRANSFER TO SUBURBAN SCHOOL - BUY A CAR",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1200, monthlyExpenses: 55, frustration: 20, carsOwned: 1 },
                result: "You buy a car and transfer to the Dearborn school. The facilities are objectively nicer. But you're now completely car-dependent just to teach children. You cannot have a teaching career without driving anymore. Monthly car costs: $55.",
                flags: { hasCarGen1: true }
            },
            {
                text: "STAY AT YOUR WALKABLE CITY SCHOOL",
                effects: { money: -85, frustration: 30 },
                result: "You stay at the city school. But enrollment's dropping as white families flee to the suburbs. There's serious talk your school might close within a few years. You kept your walkable commute but your job security feels shaky. School supplies out of pocket: $85."
            },
            {
                text: "TRANSFER EASILY - YOU ALREADY HAVE A CAR",
                requiresFlag: "hasCarGen1",
                effects: { money: -65, frustration: 15 },
                result: "You transfer to the suburban school without drama. Your commute jumps significantly but you were already prepared for car-dependent life. The new building is objectively better. You settle into driving to teach. Extra gas: $65/month."
            }
        ]
    },
    public: {
        year: 1959,
        title: "Budget Showdown: Roads vs Buses",
        narrative: "You're at a city budget meeting. Detroit's broke and choices must be made. On the table: repair the potholed roads that car owners are complaining about (helps thousands of drivers daily), OR restore bus service on routes that got cut last year (helps hundreds of transit-dependent workers). The city only has budget for one.",
        image: "images/buspotlane.jpg",
        choices: [
            {
                text: "VOTE TO RESTORE THE BUS SERVICE",
                effects: { money: -50, frustration: 30 },
                result: "You vote for the buses. You get crushed 9-1. Road repairs win in a landslide. The auto industry and car owners outnumber transit riders at every level of power. You tried. The system overwhelmingly prioritizes cars. It's not even close. Meeting lunch: $50."
            },
            {
                text: "VOTE FOR ROAD REPAIRS",
                effects: { money: -50, frustration: 20 },
                result: "You vote for the roads. It passes easily. Your own commute gets smoother. But the bus routes stay dead and won't be coming back. You're complicit in why transit keeps dying. Feels lousy but the roads genuinely needed the work. Meeting lunch: $50."
            },
            {
                text: "REFUSE TO CHOOSE - ABSTAIN",
                effects: { money: -50, frustration: 25 },
                result: "You abstain because this choice is impossible. The roads win anyway by a huge margin. You drive home on the newly smooth streets, passing people waiting at broken-down bus stops. The guilt sits heavy. Meeting lunch: $50."
            }
        ]
    }
};
const jobSpecificScenariosNYC = {
    factory: {
        year: 1959,
        title: "The Factory Moves to Jersey",
        narrative: "Your boss drops the news like a bomb: the factory's relocating across the river to New Jersey next year. Cheaper land, easier for trucks, lower taxes - all the usual reasons. That's gonna be one hell of a commute from the city. Maybe 90 minutes each way on buses and trains that don't connect well, or 45 minutes if you drive and pay the tolls. You can either shell out for a car to keep this job, pack up and follow the factory to Jersey, or start job hunting in a city that's hemorrhaging manufacturing work.",
        image: "images/factorynj.jpg",
        choices: [
            {
                text: "BUY A CAR TO KEEP THE JOB ",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1400, monthlyExpenses: 110, frustration: 25, carsOwned: 1 },
                result: "You scrape together money for a used car before the move. When the factory relocates, your commute becomes 45 minutes of driving plus bridge tolls every single day. At least you still have a paycheck. Half your coworkers without cars got laid off. This is how they force you into car ownership. Monthly car costs: $110 plus tolls that add up fast.",
                flags: { hasCarGen1: true }
            },
            {
                text: "JERSEY? NO THANKS. QUIT YOUR JOB AND FIND A NEW ONE",
                effects: { money: -900, frustration: 30},
                result: "You quit on principle. You're a NEW YORKER. You don't work in JERSEY. Three months of job hunting later and you're realizing that was maybe a dumb move. Every factory is either closed, closing, or moving to the suburbs. You finally find work at a warehouse in Queens for less pay. Pride is expensive. Job search costs and lost wages: $900.",
            },
            {
                text: "COMMUTE IN YOUR CAR",
                requiresFlag: "hasCarGen1",
                effects: { money: -120, frustration: 20 },
                result: "Your commute more than doubles and now you're paying bridge tolls twice a day. Gas costs jump dramatically. But hey, at least you kept your job - the guys relying on public transit are getting squeezed out hard. You got lucky already owning a car. Increased costs: $120/month."
            },
            {
                text: "FOLLOW THE WORK AND MOVE TO JERSEY CITY",
                effects: { money: -800, monthlyExpenses: -100, frustration: 20 },
                result: "You find a place in Jersey City to stay close to the factory. Rent's cheaper but it's no NYC. Moving costs: $800.",
                flags: { movedToSuburbs: true }
            }
        ]
    },
    teacher: {
        year: 1959,
        title: "School District Shuffle to Queens",
        narrative: "The school board's restructuring and your school is moving to a brand new building way out in Queens - bigger classrooms, modern facilities, and a massive parking lot because teachers will need cars. Your current school in Manhattan? You can walk there from your apartment. The new one is 14 miles away. The subway route takes 75 minutes with two transfers. This basically determines whether you stay in teaching or not.",
        image: "images/classroom2.jpg",
        choices: [
            {
                text: "TRANSFER TO QUEENS AND BUY A CAR",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1300, monthlyExpenses: 105, frustration: 25, carsOwned: 1 },
                result: "Transfer approved. You buy a used car specifically for this commute because there's literally no other way. The new facilities are nice but you're now completely car-dependent just to teach children. You cannot have a teaching career without driving. Monthly car costs: $105.",
                flags: { hasCarGen1: true }
            },
            {
                text: "STAY AT YOUR WALKABLE MANHATTAN SCHOOL",
                effects: { money: -90, frustration: -10 },
                result: "You stay at the walkable school in the city. But enrollment's dropping as families flee to the suburbs. There's serious talk your school might close within a few years. You kept your walkable commute but your job security feels shaky. School supplies out of pocket: $90."
            },
            {
                text: "YOU ALREADY HAVE A CAR - TRANSFER EASILY",
                requiresFlag: "hasCarGen1",
                effects: { money: -95, frustration: -15 },
                result: "You transfer to the Queens school without much drama. Commute jumps significantly but you were already prepared for car-dependent life. The new building is objectively better. You settle into driving to teach. Increased gas costs: $95/month."
            }
        ]
    },
    public: {
        year: 1959,
        title: "Budget Showdown: El Train vs The Drive",
        narrative: "You're at a city budget meeting. NYC's broke and choices must be made. On the table: restore the 3rd Avenue El service that got demolished in 1955 (would help hundreds of daily transit riders get to work), OR repave the aging FDR Drive to smooth out the terrible road conditions (would help thousands of drivers daily). The city only has budget for one.",
        image: "images/thirdaveel.jpg",
        choices: [
            {
                text: "VOTE TO RESTORE THE EL",
                effects: { money: -10, frustration: 25 },
                result: "You vote for restoring the El. You get absolutely crushed 11-2. The road repaving wins in a landslide. Car owners outnumber transit riders at every level of power. You tried. The system overwhelmingly prioritizes cars and it's not even close. You spend $10 for lunch at the meeting."
            },
            {
                text: "VOTE FOR FDR DRIVE REPAVING",
                effects: { money: -10, frustration: 20 },
                result: "You vote for the road work. It passes easily. Your own driving commute gets noticeably smoother. But the El stays dead and won't be coming back. You're complicit in why transit keeps dying. Feels lousy but the roads genuinely needed the work. You spend $10 for lunch at the meeting."
            },
            {
                text: "REFUSE TO CHOOSE - ABSTAIN",
                effects: { money: -10, frustration: 20 },
                result: "You abstain because this choice is impossible. The roads win anyway by a huge margin. You drive home on a newly paved highway, passing people stuck waiting at broken-down bus stops. The guilt sits heavy. You spend $10 for lunch at the meeting."
            }
        ]
    }
};

const nycGen1Scenarios = [
    {
        year: 1950,
        title: "Welcome to New York City",
        narrative: "You just moved to New York City with $5,000 saved! Your Manhattan apartment is $60 a month - rent controlled and affordable. The subway runs 24/7 for a dime. Every corner has a deli, a bakery, a butcher. You can walk to work in 15 minutes. This is the greatest city in the world and you have everything at your fingertips.",
        image: "images/nyc50s.jpg",
        fact: {
            text: "In 1950, nearly every apartment in NYC was rent-controlled at around $60/month. Subway fare was 10 cents. Adjusted for inflation thats $784 a month and $1.31 for the subway. Must be nice.",
            link: "https://www.matthews.com/the-history-and-workings-of-nyc-rent-regulation/"
        },
        choices: [
            {
                text: "EXPLORE EVERY NEIGHBORHOOD BY FOOT AND BY SUBWAY",
                effects: { money: -25, frustration: -10 },
                result: "Harlem jazz clubs on Friday. Village cafes on Saturday. Coney Island on Sunday. A dime gets you anywhere. Your feet memorize every shortcut between avenues. The city feels infinite and it's all yours for pocket change. You're a NEW YORKER BABY!"
            },
            {
                text: "WORK OVERTIME - BUILD YOUR SAVINGS FAST",
                effects: { money: 150, frustration: 25, jobMultiplier: true },
                result: "Time and a half pays well. Your bankroll grows but you're missing the city. Your friends invite you to a Yankees game, but you already agreed to work a double shift. You try to convince yourself Yogi Berra isn't that good. Whatever helps you sleep at night..."
            },
            {
                text: "BALANCE IT ALL - WORK AND EXPLORE",
                effects: { money: 0, frustration: 0 },
                result: "40 hours at work. No more no less. Friday nights at broadway shows - Call Me Madame was just incredible! Saturdays at Yankee Stadium. You're living the New York dream on a regular salary."
            }
        ]
    },
    {
        year: 1952,
        title: "The Car Question",
        narrative: "Your coworker Frank just bought a brand new '52 Chevy Bel Air for $1,850. Chrome gleaming, white-wall tires, the whole shabang. He's driving to Jones Beach on weekends. Taking his girl to drive-in movies upstate. The ads say 'See the USA in your Chevrolet!' But this is New York City. The subway gets you everywhere. Parking is already impossible. Do you really need a car here?",
        image: "images/chrome.jpg",
        choices: [
            {
                text: "BUY A CAR - JOIN THE AMERICAN DREAM",
                effects: { money: -1850, monthlyExpenses: 120, frustration: -10, carsOwned: 1 },
                result: "You buy a car for weekend adventures. Drives up the Hudson. Trips to the beach. It feels like freedom. Until you try to park it in Manhattan. Until the monthly garage bill arrives. Until insurance is due. The car is for leisure, not necessity. That's an expensive hobby. Monthly costs: $120.",
                flags: { hasCarGen1: true }
            },
            {
                text: "STICK WITH THE SUBWAY",
                effects: { money: -.10, frustration: -5 },
                result: "Why complicate life? You're saving money while Frank stresses about parking tickets. His car doesn't seem worth all that stress. Franks has always been a show off anyways. Subway ride home: 10 cents"
            },
            {
                text: "THINK ABOUT IT - NOT READY TO DECIDE",
                effects: { money: 0, frustration: 10 },
                result: "You sit in Frank's Chevy. Smell that new car smell. Then you get out and walk to the subway like you do every day. The street is packed with cars bumper to bumper, honking, drivers screaming 'MOVE ASSHOLE.' Sheeesh glad you're not apart of that nightmare"
            }
        ]
    },
    {
        year: 1954,
        title: "Jones Beach vs Coney Island",
        narrative: "Summer's here. Your family wants the beach. Coney Island is a 35-minute subway ride - you can literally see the ocean from the train. Jones Beach is what everyone's raving about - Robert Moses built it gorgeous with pristine sand and massive parking lots. But it's 33 miles away with zero transit. You need a car to get there.",
        image: "images/nycbeach.jpg",
        fact: {
            text: "Robert Moses deliberately designed Jones Beach to be car-accessible but nearly impossible to reach by transit. He built parkway overpasses too low for buses.",
            link: "https://ny.curbed.com/2017/6/21/15838436/robert-moses-jones-beach-history-new-york-city"
        },
        choices: [
            {
                text: "DRIVE TO JONES BEACH - SEE WHAT THE FUSS IS ABOUT",
                requiresFlag: "hasCarGen1",
                effects: { money: -12, frustration: -20 },
                result: "You drive the Southern State Parkway. Jones Beach is stunning - clean sand, great facilities, endless parking. You get it now. Moses built paradise for cars. But you just paid gas and parking to access a public beach. Beach day: $12."
            },
                        {
                text: "TAKE A CAB TO JONES BEACH",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -15, frustration: 5 },
                result: "Your driver drops you and your family off in the parking lot. Jones Beach is stunning - clean sand, great facilities, endless parking, your family is really happy they got to go. You tan, swim, relax. On the way home your cab driver yells at you for getting their seat wet. Beach day: $15."
            },
            {
                text: "SUBWAY TO CONEY ISLAND",
                effects: { money: -10, frustration: -15 },
                result: "You ride the subway to Coney Island. It's crowded and grittier than Jones but it's YOUR beach. Nathan's hot dogs. The Cyclone. The boardwalk. You can see the ocean from the train. No car needed. Subway and food: $10."
            },
            {
                text: "SORRY FAMILY - I DON'T WANT TO GO TO THE BEACH",
                effects: { money: 0, frustration: -15 },
                result: "The beach on a summer weekend? Absolutely not. Packed trains, sand everywhere, sunburn??? Not worth it. You open the fire hydrant for the kids instead, grab a cold drink from the bodega, and find a shady spot."
            },
            {
                text: "BUY A CAR TO ACCESS JONES BEACH",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1300, monthlyExpenses: 95, frustration: -10, carsOwned: 1 },
                result: "You buy a car specifically because Jones Beach is so nice and unreachable by transit. Moses designed it that way on purpose. You just got manipulated into car ownership by beach infrastructure. Welcome to the trap. Monthly: $95.",
                flags: { hasCarGen1: true }
            }
        ]
    },
    {
        year: 1959,
        title: "Job Scenario",
        narrative: "",
        image: "",
        choices: []
    },
    {
        year: 1962,
        title: "PENN STATION GETS DEMOLISHED",
        narrative: "They're tearing down Penn Station. The most beautiful train station in America - demolished to build Madison Square Garden. It's heartbreaking. This Beaux-Arts masterpiece is being reduced to rubble for profit. Rail ridership is down because highways and airports get all the investment. The city is choosing cars and planes over trains. New York is killing its own architectural heritage.",
        image: "images/pennstation.png",
        fact: {
            text: "Penn Station's demolition began in 1963. The loss sparked the historic preservation movement. It symbolized America's shift from rail to car culture.",
            link: "https://www.nyhistory.org/blogs/penn-station-masterpiece"
        },
        choices: [
            {
                text: "JOIN THE ACTIVISTS IN PROTESTING",
                effects: { money: -50, frustration: 15 },
                result: "You attend rallies and write letters, but it's no use. The railroad needs money, and developers see gold. Your protests are drowned out by jackhammers. The beautiful station falls anyway. At least you tried to save something irreplaceable."
            },
            {
                text: "IT'S SAD, BUT CITIES NEED TO MODERNIZE",
                effects: { money: 0, frustration: 5 },
                result: "Progress requires sacrifice. The new Madison Square Garden will bring jobs and revenue. Penn Station was beautiful, but maintaining it was expensive. The rail is still there, it's just underground now. Honestly, rail is dying anyway - everyone's driving or flying now. Sometimes beauty has to give way to economics."
            },
            {
                text: "FOCUS ON YOUR OWN COMMUTE",
                effects: { money: 10, frustration: 0 },
                result: "You have your own problems. Let the preservationists and developers fight it out. You just need to get to work. Whether it's a beautiful station or an ugly one doesn't change your daily grind. The train is still running."
            }
        ]
    },
    {
        year: 1965,
        title: "The Great Blackout",
        narrative: "November 9, 1965. 5:27pm. The lights go out. All of them. Thirty million people across the Northeast plunged into darkness. In NYC, 800,000 people trapped in subway tunnels. No power for 13 hours. You're stuck wherever you are when it happens. This tests everything about how the city works without electricity.",
        image: "images/nycblackout.jpg",
        fact: {
            text: "The outage affected 30 million people across eight U.S. states and parts of Canada. It was the largest power failure in North American history at the time. It trapped 800,000 in subway tunnels. ",
            link: "https://www.nyhistory.org/blogs/lights-out-recalling-the-1965-blackout"
        },
        choices: [
            {
                text: "YOU'RE TRAPPED IN THE SUBWAY FOR HOURS 😭 ",
                requiresNoFlag: "hasCarGen1",
                effects: { money: 0, frustration: 40 },
                result: "OH NO. You're on the train when the lights die. Pitch black. Hundreds trapped underground. Strangers light matches. People help each other walk along tracks to stations. You emerge hours later. The sunlight hurts your eyes. You pray that never happens again."
            },
            {
                text: "YOU DRIVE HOME WITH NO TRAFFIC LIGHTS",
                requiresFlag: "hasCarGen1",
                effects: { money: -3, frustration: -10 },
                result: "You're in your car when the blackout hits. Traffic lights are dead but you you eventually make it home safely. Your subway-riding neighbors are trapped for hours, a fear of yours. Gas: $3."
            },
            {
                text: "YOU WALK HOME IN THE DARK",
                requiresFlag: "hasCarGen1",
                effects: { money: 0, frustration: 10 },
                result: "You walk home in darkness. Strangers share candles. Neighbors check on each other. Churches open. It doesn't feel like real life. You realize how dependent we are on technology and power."
            }
        ]
    },
   {
    year: 1966,
    title: "Subway Fare Increases to 20 Cents",
    narrative: "The subway fare jumps from 15 cents to 20 cents. That's a 33% increase overnight. People are pissed. The Transit Authority says it's necessary to maintain service. Your monthly commute costs went from $9 to $12. Not huge money but the principle stings. The subway costs more while Robert Moses's free highways get billions in funding.",
    image: "images/fareincrease.jpg",
    fact: {
        text: "Subway fare increased from 15¢ to 20¢ in 1966 - a 33% increase. Riders protested while highway construction received massive federal funding.",
        link: "https://www.6sqft.com/all-the-mta-fare-hikes-over-the-last-100-years/"
    },
    choices: [
        {
            text: "PAY THE HIGHER FARE",
            requiresNoFlag: "hasCarGen1",
            effects: { money: -3, monthlyExpenses: 3, frustration: 20 },
            result: "You drop 20 cents in the turnstile and seethe quietly. The fare keeps rising. When you get down to the platform you realize your train isn't coming for another 15 minutes. Why the hell do I have to pay 20 cents for this...?! Fare increase: $3/month."
        },
        {
            text: "THINK ABOUT GETTING A CAR",
            requiresNoFlag: "hasCarGen1",
            effects: { money: 0, frustration: 10 },
            result: "You start doing the math. A used car is maybe $1,500. Gas, insurance, parking... it adds up. But at least you wouldn't be at the mercy of the MTA's bullshit fare hikes. The seed is planted. Your neighbors who bought cars last year keep bragging about their 'freedom.' Maybe they're onto something."
        },
        {
            text: "PROTEST THIS NONSENSE",
            effects: { money: 0, frustration: 15 },
            result: "You join a group of angry riders protesting at City Hall. Today its 20 cents, tomorrow 30, 40, until one day they're charging a $1?? OR GOD FORBID $2! It's an outrage! The Transit Authority shrugs. The fare stays at 20 cents. Your boss docks your pay for missing work."
        },
        {
            text: "IT'S OK - YOU ONLY USE THE SUBWAY WHEN YOU HAVE TO",
            requiresFlag: "hasCarGen1",
            effects: { money: 0, frustration: 5 },
            result: "The fare increase doesn't really bother you. You drive on weekends. Take the subway when traffic is bad. Your transit-dependent neighbors are complaining. You shrug sympathetically while thinking about your next road trip to Jones Beach. Oil change: $8."
        }
    ]
},
    {
        year: 1968,
        title: "Visiting Family in Long Island",
        narrative: "Your partner's parents moved to Levittown Long Island. Modern kitchen, big yard, two-car garage, all of it. They want you visiting every Sunday for family dinner. It's 25 miles east. You can take the Long Island Rail Road most of the way then they pick you up at the station. Or drive if you have a car. Or visit less...(your vote).",
        image: "images/levittown.jpg",
        fact: {
            text: "Levittown was America's first mass-produced suburb, built on Long Island starting in 1947. Using assembly-line techniques, developers cranked out thousands of identical homes for WWII veterans with GI Bill loans. Black veterans were explicitly barred. It became the blueprint for car-dependent suburban sprawl across America.",
            link: "https://www.history.com/news/levittown-housing-segregation"
        },
        choices: [
            {
                text: "BUY A CAR FOR FAMILY VISITS AND WEEKEND TRIPS",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1400, monthlyExpenses: 105, frustration: -15, carsOwned: 1 },
                result: "You buy a used car for visiting family and weekend escapes. Now you can drive to Long Island whenever (yay...). But you're paying $105/month to own a car you only really use on weekends. Suburban family geography pushed you into car ownership. It's easy to park once you get there, but their neighborhood is just copy and paste. Monthly: $105.",
                flags: { hasCarGen1: true }
            },
            {
            text: "DRIVE UP EVERY SUNDAY AS REQUESTED BY MOTHER-IN-LAW",
            requiresFlag: "hasCarGen1",
            effects: { money: -100, frustration: 10 },
            result: "Every Sunday you drive 25 miles out to Levittown for pot roast and passive-aggressive comments about when you're having kids. The drive's not terrible. The neighborhood is identical houses as far as the eye can see. Just lawns and driveways. Your mother-in-law keeps saying how 'convenient' everything is and that you and your partner should consider moving there. Gas for visits: $100."
            },
            {
                text: "TAKE LIRR AND THEY PICK YOU UP FROM THE STATION",
                effects: { money: -20, monthlyExpenses: 20, frustration: 20 },
                result: "You take the train. They pick you up. The whole trip takes 90 minutes each way every Sunday. They keep hinting you'd visit more if you had a car, but they always think you're doing something wrong anyway. Monthly LIRR: $20."
            },
            {
                text: "VISIT ONCE A MONTH INSTEAD OF WEEKLY",
                effects: { money: -10, frustration: -5 },
                result: "You compromise on monthly visits instead of weekly. Your partner is annoyed. Their parents feel rejected. But sorry you're not spending every Sunday traveling to the suburbs for an afternoon of passive-agressive comments of why you don't have kids yet. Monthly visits: $10."
            }
        ]
    },
    {
        year: 1970,
        title: "Parking is Hell",
        narrative: "If you own a car in Manhattan, your entire life revolves around parking. Circling blocks for 45 minutes hunting for spots. Alternate side parking rules that change by street. Tickets every other week. Monthly garages want $85. Your 'freedom machine' sits unused most days costing you money while you take the subway to work anyway.",
        requiresFlag: "hasCarGen1",
        image: "images/parkingnyc.jpg",
        choices: [
            {
                text: "PAY FOR A MONTHLY GARAGE",
                effects: { money: -510, monthlyExpenses: 85, frustration: -20 },
                result: "You pay $85/month for a garage spot. The car sits there unused while you take the subway to work because driving in Manhattan is insane. You're paying to store a car you barely use. Another hidden cost. Monthly garage: $85."
            },
            {
                text: "KEEP STREET PARKING",
                effects: { money: -120, frustration: 25 },
                result: "You set alarms to move your car for street cleaning. You've gotten twelve tickets this year. You spend 20 minutes every night hunting for a legal spot. This is absurd. Your palms hurt from banging your hands against the steering wheel in frustration. Annual tickets: $120."
            },
            {
                text: "SCREW THIS - SELL THE CAR",
                effects: { money: 850, monthlyExpenses: -120, frustration: -15, carsOwned: -1 },
                result: "You sell it. Take the cash and go back to full-time subway use. The car was a nice idea but parking is driving you crazy. At least now you don't have to go see your in-laws every week. Sold: $850.",
                flags: { soldCarGen1: true, hasCarGen1: false }
            }
        ]
    },
    {
        year: 1973,
        title: "The Gas Crisis",
        narrative: "October 1973. Oil embargo. Gas prices double from 36¢ to 53¢ overnight. Lines around the block. Odd-even rationing by license plate. Stations run dry by noon. If you have a car, you're waiting two hours for eight gallons. If you don't, you're taking the subway like always. Car ownership suddenly looks really stupid when you're chained to gas lines.",
        image: "images/nycoil.jpg",
        fact: {
            text: "The 1973 oil embargo caused gas to jump from 36¢ to 53¢ overnight - a 47% increase. Americans waited hours in line as stations ran dry.",
            link: "https://history.state.gov/milestones/1969-1976/oil-embargo"
        },
        choices: [
            {
                text: "WAIT IN GAS LINES",
                requiresFlag: "hasCarGen1",
                effects: { money: -80, monthlyExpenses: 25, frustration: 50 },
                result: "You wake at 6am to beat the crowds. You don't beat them. One hour in line for eight gallons. Multiple times per month. Your gas costs nearly doubled. That weekend 'freedom' doesn't feel free anymore. Crisis costs: $80, monthly: +$25."
            },
            {
                text: "WATCH THE CRISIS UNFOLD",
                requiresNoFlag: "hasCarGen1",
                effects: { money: 0, frustration: 5 },
                result: "The gas crisis happens around you. Car owners panicking at every station. You take the subway like always. Food prices tick up slightly but you're not waiting in any lines. Sometimes not having a car in NYC is the smartest move possible."
            },
            {
                text: "SELL YOUR CAR",
                requiresFlag: "hasCarGen1",
                effects: { money: 600, monthlyExpenses: -130, frustration: -20, carsOwned: -1 },
                result: "The gas crisis makes you realize the car was never freedom - just a different dependency. You sell it and go back to the subway. The subway can't be embargoed...you hope. Sold for: $600.",
                flags: { soldCarGen1: true, hasCarGen1: false }
            }
        ]
    }
];
const nycGen2Scenarios = [
    {
        year: 1975,
        title: "Generation 2: The City is Broke",
        narrative: "The city your parents left you is literally bankrupt. The Daily News screams 'FORD TO CITY: DROP DEAD.' Services slashed. Police laid off. Subway maintenance stopped. Garbage piling up. But you want to try the city out for yourself. It's all in your hands now.",
        image: "images/DropDeadCityFordPaper.png",
        fact: {
            text: "In 1975 NYC nearly went bankrupt. President Ford refused federal bailout. Services were slashed, police laid off, subway maintenance stopped. The city was in crisis.",
            link: "https://www.nytimes.com/2006/10/29/nyregion/29veto.html"
        },
        choices: [
            {
                text: "Start Generation 2 in the city",
                effects: { monthlySalary: 3800, monthlyExpenses: 1000 },
                result: "You're entering adulthood during New York's darkest moment. The city that never sleeps feels like its on life support. But it's still your city and this is a fresh start. Time to see if it/ you survives."
            }
        ]
    },
    {
        year: 1977,
        title: "The Night of Terror",
        narrative: "July 13, 1977. 9:30pm. Lightning hits. The power dies completely. Unlike the 1965 blackout, this time the city explodes into chaos. Looting in 31 neighborhoods. 1,037 fires in one night. 3,776 arrests. The city is bankrupt, it's 100 degrees, and now the lights are out. What is happening?? Another blackout are you serious?",
        image: "images/1977nyc.jpg",
        fact: {
            text: " A 25-hour blackout, triggered by lightning striking key transmission lines, led to widespread looting, riots, and more than a thousand fires",
            link: "https://gothamist.com/news/remembering-nycs-1977-blackout-46-years-later"
        },
        choices: [
            {
                text: "WALK AROUND IN THE DARK",
                requiresNoFlag: "hasCarGen2",
                effects: { money: 0, frustration: 5 },
                result: "No trains. You walk miles through dark streets. Zero mobility options. People with cars drove home hours ago. Total dependence on transit means total vulnerability when it fails."
            },
            {
                text: "CALL YOUR PARENTS TO PICK YOU UP",
                requiresNoFlag: "hasCarGen2",
                effects: { money: 0, frustration: 35 },
                result: "You call your parents to help you get out of the city and wait it at their house. They call you crazy on the phone! They wouldn't drive into the city even IF the traffic lights were working, and they're NOT."
            },
            {
            text: "DRIVE TO YOUR PARTNER'S PARENTS IN LONG ISLAND",
            requiresFlag: "hasCarGen2",
            effects: { money: -15, frustration: -20 },
            result: "Ugh really?? You really don't want to but your partner wants to. You drive to Levittown with no traffic lights, just car headlights. Your mother-in-law greets you at the door: 'I KNEW you'd come! I told Frank you'd show up!' She spends the evening pointing out how the suburbs have 'backup generators' and 'didn't descend into chaos.' In the morning she mentions the house for sale three blocks over. Gas: $15."
        },
        {
            text: "DRIVE AROUND TO KILL TIME",
            requiresFlag: "hasCarGen2",
            effects: { money: 0, frustration: -35 },
            result: "Are you CRAZY?? There are no traffic lights! You pull out of your parking spot and immediately almost get T-boned at the first intersection. Every intersection is a free-for-all. Horns blaring. You drive two blocks, your knuckles white on the steering wheel, before giving up and heading back home. Having a car doesn't mean shit when the infrastructure collapses."
        },
            {
                text: "WAIT IT OUT IN YOUR APARTMENT",
                effects: { money: 0, frustration: 15 },
                result: "You live on the 7th floor.No elevators. No lights. No AC in 100-degree heat. You're stuck climbing 7 flights in pitch black or sweating it out upstairs. You aren't leaving your apartment until this all blows over. The city's vertical living is hell without power. Sometimes you dream about living on a remote farm..."
            },
        ]
    },
    {
        year: 1980,
        title: "The Transit Strike Strands Everyone",
        narrative: "April 1980. Transit workers strike. ALL subway and bus service shuts down for 11 days. Eight million people stranded. If you have a car or live in suburbs, you're fine. If you're car-free in the city, you're completely stuck. The fragility of transit dependency is suddenly very real and very scary.",
        requiresNoFlag: "hasCarGen1",
        image: "images/strikenyc.jpg",
        fact: {
            text: "The 1980 transit strike lasted 11 days, shutting down all subway/bus service. It exposed how fragile the system was and how vulnerable car-free residents were to strikes.",
            link: "https://www.nytimes.com/2005/04/04/nyregion/25-years-ago-subways-and-buses-stopped-running.html"
        },
        choices: [
            {
                text: "SCREW THIS! MOVE TO THE SUBURBS",
                effects: { money: -2500, frustration: -20 },
                result: "This strike was your last straw. You can't deal with this anymore, nor do you want to. Maybe city life isn't for you. You pack up, move to Jersey, and buy a brand new car because you know what you deserve it."
            },
            {
                text: "TOUGH IT OUT. YOU'RE A REAL NEW YORKER",
                requiresNoFlag: "hasCarGen2",
                effects: { money: -180, frustration: 50 },
                result: "Eleven days. You walk miles to work. Borrow friends' cars. Call in sick three days. Share expensive cabs. It's absolutely brutal. After this hell, you're reconsidering whether total transit dependency is wise. Cab costs: $180."
            },
            {
                text: "BUY A CAR AFTER THIS - NEVER BE STRANDED AGAIN",
                requiresNoFlag: "hasCarGen2",
                effects: { money: -7500, monthlyExpenses: 280, frustration: 5, carsOwned: 1 },
                result: "The strike teaches you that total transit dependency is risky. You buy a car as insurance for next crisis. You'll still take subway most days. But now you have options when the system fails you. Monthly: $280.",
                flags: { hasCarGen2: true }
            }
        ]
    },
    {
        year: 1983,
        title: "Your First Baby",
        narrative: "Congrats!! You just had your first baby. Tiny human, big logistics. Suddenly everyone has opinions about how you should live your life. The baby just wants milk and doesn't care about your transportation choices. What kind of parent will you be?",
        image: "images/baby.gif",
        choices: [
            {
                text: "BUY A CAR FOR BABY LOGISTICS AND DOCTORS VISITS",
                requiresNoFlag: "hasCarGen2",
                effects: { money: -9000, monthlyExpenses: 370, frustration: -20, carsOwned: 1 },
                result: "You buy a car for baby life. Car seat installed. Drive to pediatrician. Visit grandparents easily. Emergency room access. Parenthood pushed you into car ownership even in transit-rich NYC. Monthly costs: $370.",
                flags: { hasCarGen2: true }
            },
            {
                text: "YOUR BABY IS GOING TO BE A REAL NEW YORKER - TAKE THEM RIDING ON THE SUBWAY",
                requiresNoFlag: "hasCarGen2",
                effects: { money: -45, monthlyExpenses: 45, frustration: 40 },
                result: "You haul that stroller up and down subway stairs every single day. Strangers help sometimes. You're saving $325/month. Your suburban friends pity you but your city friends respect the commitment. Occasional taxis: $45."
            },
            {
                text: "MOVE TO THE SUBURBS NEAR GRANDPARENTS",
                effects: { money: -11000, monthlyExpenses: 450, frustration: -15, carsOwned: 1 },
                result: "You move near grandparents for help with baby. Buy a car because suburbs require it. Now you drive everywhere - daycare, pediatrician, Target. Parenthood plus suburban geography equals mandatory car ownership. Moving and car: $11,000.",
                flags: { movedToSuburbs: true, hasCarGen2: true }
            },
            {
                text: "BUY BIGGER CAR",
                requiresFlag: "hasCarGen2",
                effects: { money: -9500, monthlyExpenses: 200, frustration: -15, carsOwned: 1 },
                result: "A baby means needed something bigger. Minivan or SUV. More space for strollers and car seats and all the baby gear. You want your baby to have the BEST safety features. Bigger car: $9,500.",
                flags: { hasMinivan: true }
            },
            {
                text: "MAKE DO WITH THE CAR YOU HAVE",
                requiresFlag: "hasCarGen2",
                effects: { money: -70, monthlyExpenses: 200, frustration: 15, carsOwned: 1 },
                result: "After your baby's appointment, you stuff their stroller into the trunk of the car. Your partner texts you asking if you can stop by the store to get this weeks groceries. You don't have anymore space in the trunk but you make do and put the grocieries in the back seat. You weren't thinking and put the eggs on the seat. On the way home they fall over and break. This weeks grocieries: $70 ",
                flags: { hasMinivan: true }
            }
        ]
    },
{
    year: 1986,
    title: "Reagan Cuts Transit Funding 40%",
    narrative: "The federal government slashes transit funding by 40%. In NYC this means fewer repairs, longer waits, more service cuts. Weekend and late-night service reduced. Some lines considered for closure. Meanwhile highway funding increases. The message is clear: cars matter, transit doesn't.",
    image: "images/reagancut.jpg",
    fact: {
        text: "In 1986 Reagan cut transit funding by 40% nationwide. Routes disappeared, service plummeted. Highway funding simultaneously increased.",
        link: "https://www.nytimes.com/1986/01/05/us/reagan-seeks-cut-of-40-in-funds-for-mass-transit.html"
    },
    choices: [
        {
            text: "THIS IS AN OUTRAGE - WRITE YOUR REPRESENTATIVES",
            effects: { money: -15, frustration: 35 },
            result: "You write angry letters to Congress. They don't care. Reagan's transportation secretary says 'local transit is a local problem.' The federal government is actively choosing cars over transit. Your letters change nothing. Postage: $15."
        },
        {
            text: "MAKES SENSE - CAR INSFRASTRUCTURE IS MORE IMPORTANT",
            requiresFlag: "hasCarGen2",
            effects: { money: 0, frustration: -5 },
            result: "You own a car so you see the logic. Most Americans drive. Why should federal money subsidize city subways? Let cities pay for their own transit. You benefit from the highway spending anyway."
        },
        {
            text: "TIME TO SERIOUSLY CONSIDER BUYING A CAR",
            requiresNoFlag: "hasCarGen2",
            effects: { money: 0, frustration: 20 },
            result: "The transit cuts are a warning. The government is betting on cars, not trains. Maybe you're on the wrong side of history. Everyone with money is driving. The subway is there but you're worried for the future."
        },
    ]
},
{
    year: 1988,
    title: "The Subway System is Collapsing",
    narrative: "The subway is in total crisis. Trains catch fire 2,500 times per YEAR. Over 300 trains abandoned daily. On-time performance: 50%. Graffiti everywhere. Crime rampant - 250 felonies per week underground. 17,497 felonies in 1990 alone. The thing that makes NYC work is broken.",
    image: "images/subwaynyc.jpg",
    fact: {
        text: "In the late 1980s, subway cars caught fire 2,500 times annually. Over 300 trains abandoned daily. The system was collapsing completely.",
        link: "https://allthatsinteresting.com/new-york-subways-1980s"
    },
    choices: [
        {
            text: "BUY A CAR - YOU CANNOT TAKE THIS ANYMORE",
            requiresNoFlag: "hasCarGen2",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -9500, monthlyExpenses: 340, frustration: -25, carsOwned: 1 },
            result: "You're done. Burning trains, constant danger, endless delays. You buy a car. Driving in NYC traffic beats this nightmare. The subway crisis forced you into car ownership. Monthly: $340.",
            flags: { hasCarGen2: true }
        },
        {
            text: "TOUGH IT OUT - AS WE'VE ALREADY ESTABLISHED YOU'RE A REAL NEW YORKER",
            requiresNoFlag: "hasCarGen2",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: 0, frustration: 30 },
            result: "You keep riding. Trains are disgusting and terrify you a little, but you won't admit that. You've been mugged once, but hey everyone in New York gets mugged once. It's like a right of passage. And you're saving $340/month. You don't quit on the city."
        },
        {
            text: "DRIVE EVERYWHERE NOW - ABONDON THE CITY COMPLETELY",
            requiresFlag: "hasCarGen2",
            effects: { money: -90, frustration: -15 },
            result: "You have a car so you stopped taking the subway entirely. Drive or cab everywhere. The system collapsed but you're insulated. Traffic is worse because everyone's doing this but it beats burning trains. Parking and gas: $90."
        },
        {
            text: "JOIN A TRANSIT ADVOCACY GROUP",
            requiresNoFlag: "hasCarGen2",
            effects: { money: -20, frustration: -15 },
            result: "You join the Straphangers Campaign and start attending meetings. You donate $20 that goes toward printing flyers nobody reads. You learn the subway's problems are systemic—decades of deferred maintenance and budget cuts. Armed with facts and righteous anger, you try explaining this to your neighbors. They nod politely and keep complaining about 'those people' on the trains."
        },
        {
            text: "MOVE TO THE SUBURBS TO ESCAPE",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -8000, monthlyExpenses: 200, frustration: 20, carsOwned: 1 },
            result: "The subway crisis is the final straw. You move to Long Island. You need a car for local trips. The failing subway pushed you out of the city. You have to drive and pay $30 for parking at Shea Stadium now. Moving costs: $8,000.",
            flags: { movedToSuburbs: true, hasCarGen2: true }
        },
    ]
},
{
    year: 1992,
    title: "Partner's Job Offer in Stamford",
    narrative: "Your partner gets an amazing job offer in Stamford, Connecticut. Way better pay, real career advancement. It's 45 miles north. They could drive (need a car) or take Metro-North ($380/month). You work in Manhattan. What should you do?",
    image: "images/stamford.jpg",
    choices: [
        {
            text: "BUY A CAR SO PARTNER CAN DRIVE TO STAMFORD",
            requiresNoFlag: "hasCarGen2",
            effects: { money: -11000, monthlyExpenses: 380, frustration: -10, carsOwned: 1 },
            result: "You buy a car for the Connecticut commute. They drive 90 minutes each way. You still take subway to Manhattan. One-car household works. You use the car to visit family and go to drive-thrus outside of Manhattan. Monthly: $380.",
            flags: { hasCarGen2: true }
        },
        {
            text: "PARTNER TAKES METRO-NORTH",
            effects: { money: -190, monthlyExpenses: 380, frustration: -15 },
            result: "They take Metro-North daily. $380/month pass. It works but it's expensive and adds commute time. They're cranky when they get home. Monthly pass: $380."
        },
        {
            text: "BUY SECOND CAR - BOTH NEED INDEPENDENCE",
            requiresFlag: "hasCarGen2",
            effects: { money: -12000, monthlyExpenses: 380, frustration: -15, carsOwned: 1 },
            result: "Two-car household now. Partner drives to Connecticut. You keep your car. Two insurance bills, double gas. Dual-income suburban job life demands this. Monthly second car: $380."
        },
        {
            text: "MOVE TO CONNECTICUT",
            effects: { money: -15000, monthlyExpenses: 500, frustration: 20, carsOwned: 1 },
            result: "Bye bye New York - You move to Stamford. Buy a car. You drive to Metro-North to reverse-commute to Manhattan. Partner drives to work. Completely car-dependent life now. You spend everyday waiting for Saturday. Saturdays you spend dreading Monday. Moving and car: $15,000.",
            flags: { movedToSuburbs: true, hasCarGen2: true }
        },
        {
            text: "PARTNER TURNS DOWN THE JOB",
            effects: { money: 0, frustration: 40 },
            result: "They turn down Stamford. The commute logistics and car costs weren't worth it. The career opportunity is gone. There are lots of great jobs in NYC."
        }
    ]
},

{
    year: 1994,
    title: "Subway starts getting better",
    narrative: "New mayor Rudy Giuliani is cracking down hard. Broken windows policing. The subway is getting cleaner - slowly. Crime dropping. The city is coming back from the edge. Maybe New York isn't doomed after all. Maybe you don't need to flee. Maybe the city can work again.",
    image: "images/policenyc.jpg",
    fact: {
        text: "Crime in NYC dropped 56% during the 1990s. The subway was cleaned of graffiti. The city transformed from 'ungovernable' to safe.",
        link: "https://www.city-journal.org/article/how-new-york-became-safe-the-full-story"
    },
    choices: [
        {
            text: "CELEBRATE THE SUBWAY GETTING BETTER",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: 0, frustration: -25 },
            result: "You stayed through the worst years. Now you're seeing the payoff. The subway is cleaner. Streets safer. The city is coming back. Loyalty to New York is being rewarded."
        },
        {
            text: "BE HAPPY THE SUBWAY IS GETTING SAFER",
            requiresFlag: "movedToSuburbs",
            effects: { money: -12000, monthlyExpenses: 400, frustration: -25 },
            result: "Even in the suburbs you still work and do activities in NYC, so feeling comftorable to take the subway again is a wonderdul feeling. You no longer have to call cabs all the time. ",
            flags: { movedToSuburbs: false }
        },
        {
            text: "RESEARCH WHAT BROKEN WINDOW POLICING REALLY MEANS",
            image:"images/policenyc.jpg",
            effects: { money: 0, frustration: 25 },
            result: "The city is safer but at what cost? Broken windows policing means aggressive enforcement of minor offenses - disproportionately targeting Black and brown communities. Stop-and-frisk. Criminalizing homelessness. Mass incarceration for turnstile jumping. Crime dropped nationwide in the 90s, not just NYC. Was this policy necessary or just cruel?"
        },
        {
            text: "SELL YOUR CAR - TRANSIT IS BETTER",
            requiresFlag: "hasCarGen2",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: 4500, monthlyExpenses: -340, frustration: -20, carsOwned: -1 },
            result: "The subway improved so much you sell the car. Back to full-time transit. The city you bought a car to escape is now safe enough to ditch the car. Full circle. Sold: $4,500.",
            flags: { soldCarGen2: true, hasCarGen2: false }
        },
        {
            text: "CONSIDER MOVING BACK TO THE CITY",
            requiresFlag: "movedToSuburbs",
            effects: { money: -12000, monthlyExpenses: 400, frustration: -5 },
            result: "You move back to the city. You sell the suburban house and buy a city apartment. You can walk and take transit again. Real estate prices are rising fast. Moving back: $12,000.",
            flags: { movedToSuburbs: false }
        },
        {
            text: "KEEP THE CAR AND USE TRANSIT WHEN YOU WANT",
            requiresFlag: "hasCarGen2",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: 0, frustration: -10 },
            result: "The subway's better but you're keeping the car anyway. You're used to the freedom. The costs are manageable. Why give up the optionality? You're hedging your bets on NYC's future."
        }
    ]
},
{
    year: 1996,
    title: "Your Teen Needs to Get Places",
    narrative: "Your teenager just got their license and they want some spending money and to start saving more for college. They get a part time job at their favorite retail store. 20 minutes by car or you could bike or train. Their friends drive. Do they need a car?",
    image: "images/claire-driving.gif",
    choices: [
        {
            text: "BUY THEM A CAR",
            effects: { money: -6500, monthlyExpenses: 310, frustration: 5, carsOwned: 1 },
            result: "You buy them an old Toyota. They can get to work and see friends. Teen insurance is brutal - $280/month. But they have freedom. You're paying for their independence. Car: $6,500, monthly: $310.",
            flags: { teenHasCar: true }
        },
        {
            text: "THEY TAKE THE SUBWAY - YOU'RE A REAL NEW YORKER AND YOUR CHILD IS GOING TO BE TO!",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -70, monthlyExpenses: 70, frustration: 25 },
            result: "They take the subway to Queens for work. Your teen can have independence without a car because you're in NYC. They complain but during this age they complain about everything. Monthly MetroCard: $70."
        },
        {
            text: "SHARE YOUR CAR",
            requiresFlag: "hasCarGen2",
            effects: { money: -120, frustration: 40 },
            result: "You share one car between three people. The scheduling is impossible. Someone's always stranded. Your teen misses work. Your partner's frustrated. This isn't sustainable. Extra gas and stress: $120."
        },
        {
            text: "TELL THEM TO GET A JOB CLOSER TO HOME",
            effects: { money: 0, frustration: 20 },
            result: "They quit their job and find something walkable. Less pay, less interesting work. But no car needed. Your teen resents the limitation. They'll get over it."
        },
        {
            text: "BUY THEM A BIKE TO GET TO WORK",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -250, frustration: -5 },
            result: "You buy them a decent bike. They ride to their job daily. It's exercise but exhausting. Now their manager wants them to take a closing shift...should they be biking that late at night? Bike and lock: $250."
        }
    ]
},
 {
                year: 1998,
                title: "The Atlanta Olympics Disaster",
                narrative: "You're taking the family to the Olympics in Atlanta for a once-in-a-lifetime trip. The city promised world-class transit to handle the massive crowds. The reality: packed buses with drivers who don't know the routes, MARTA trains that don't actually connect to the venues, rental cars at triple the normal price. This was supposed to be fun.",
                image: "images/olympics.jpg",
                fact: {
                    text: "The 1996 Atlanta Olympics were an unmitigated transportation disaster. Bus drivers got lost during major events. Athletes arrived late to their own competitions. The IOC demanded changes to prevent another Atlanta.",
                    link: "https://creativeloafing.com/content-214744-atlanta-olympics-were-an-unmitigated-transport"
                },
                choices: [
                    {
                        text: "RENT A CAR AT AN INFLATED PRICE",
                        effects: { money: -500, frustration: 35 },
                        result: "You wait two hours in the rental car line. Parking near the Olympic venues costs $40 each time. You spend more time sitting in Atlanta traffic than actually watching events. This was supposed to be a once-in-a-lifetime family experience. Instead it became a $500 lesson in American transportation failure."
                    },
                    {
                        text: "TRY TO USE MARTA AND HOPE TRANSIT WORKS",
                        effects: { money: -30, frustration: 55 },
                        result: "You miss the opening ceremony entirely - the bus just never came. The train was so packed you physically couldn't board. Your kid is crying. Your spouse is furious. You wasted the entire day just trying to get to the venue. You should have just driven."
                    },
                    {
                        text: "SKIPE THE OLYMPICS - LOGISTICS TOO STRESSFUL",
                        effects: {frustration: 50 },
                        result: "You give up on going entirely. The logistics are just too stressful and expensive to figure out. You watch the Olympics on TV instead. Your kid is disappointed. You're disappointed. American transportation infrastructure just failed your family vacation."
                    }
                ]
            },
{
    year: 1998,
    title: "Everyone's Obsessed with Costco",
    narrative: "Your coworkers won't shut up about Costco. 'I got a 50-pack of bagels for $6!' 'Toilet paper for three months!' The nearest one is in Astoria or Jersey through the Holland Tunnel. Your corner bodega charges $4.50 for cereal. Costco has it for $6, but you're getting 3 boxes. Getting there without a car means taking Metro-North to Yonkers then a cab, or PATH to Jersey then... another cab? How do you carry it all?",
    image: "images/costco.jpg",
    choices: [
        {
            text: "DRIVE TO COSTCO AND SEE WHATS UP",
            requiresFlag: "hasCarGen2",
            effects: { money: -65, monthlyExpenses: -150, frustration: -10 },
            result: "Monthly Costco runs. You load the trunk with industrial amounts of everything. Your freezer is FULL. The savings are real - $150/month. Your friends without cars are jealous. You offer to take them sometime. You're a good friend. You think about getting a bigger car. Membership, gas: $65.",
            flags: { hasCostcoMembership: true }
        },
        {
            text: "RENT A CAR MONTHLY FOR BULK SHOPPING",
            requiresNoFlag: "hasCarGen2",
            effects: { money: -120, monthlyExpenses: 100, frustration: 15 },
            result: "You rent a car once a month for Costco runs. Drive to Astoria, load up, return the car. It's cheaper than owning but still costs money. You're definitely saving on groceries though. Is this worth the hassle? Maybe. Monthly rental: $120."
        },
        {
            text: "STICK WITH BODEGAS",
            requiresNoFlag: "hasCarGen2",
            effects: { money: 0, frustration: 15 },
            result: "You stay loyal to your corner bodega. Yeah it's expensive but it's RIGHT THERE. You can walk there in pajamas at midnight. Costco people can keep their 72-packs of everything. You're paying for walkability and you're okay with that."
        },
        {
            text: "WHY WOULD I NEED EVERYTHING IN BULK...?",
            requiresFlag: "hasCarGen2",
            effects: { money: 0, monthlyExpenses: -180, frustration: -15 },
            result: "You have a car but you're not joining the Costco cult. Why do you need 72 rolls of toilet paper? A lifetime supply of mayo? You're perfectly happy buying normal amounts of things at normal stores. Your friends with Costco memberships keep trying to convert you. You're good.",
        }
    ]
},
{
    year: 2001,
    title: "Your Car Literally Dies on the BQE",
    narrative: "Brooklyn-Queens Expressway. Rush hour. Your car makes a horrible grinding noise and just... stops. Dead. Traffic backs up behind you for MILES. People are screaming. Honking. Calling you terrible names...You're mortified. Tow truck: $95. Mechanic: 'Yeah, transmission is completely shot. $2,900 to fix.' The car is 13 years old. You could junk it for $900, buy something newer, lease something reliable, or say screw it. What now?",
    requiresFlag: "hasCarGen2",
    image: "",
    choices: [
        {
            text: "FIX IT",
            effects: { money: -2995, frustration: 35 },
            result: "Tow plus transmission: $2,995. The car runs again but it's ancient and probably gonna die again soon. You're basically in an abusive relationship with this vehicle. But you can't imagine life without it now. Total: $2,995."
        },
        {
            text: "BUY A NEWER USED CAR",
            effects: { money: -9000, monthlyExpenses: 50, frustration: -10 },
            result: "Junk it for $900, buy a 2000 Honda for $10,000. Way more reliable. Lower insurance. The debt cycle continues forever but at least this one won't die on the BQE. Probably. Net cost: $9,000."
        },
        {
            text: "LEASE A NEW CAR",
            effects: { money: -2000, monthlyExpenses: 450, frustration: 5 },
            result: "You lease a brand new 2001 Toyota Camry. No more breakdowns! No more repairs! Just $450/month forever. You're trapped in the lease cycle but the car is perfect and shiny and WORKS. Down payment: $2,000, monthly: $450."
        },
        {
            text: "JUNK IT AND GO BACK TO THE SUBWAY",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: 900, monthlyExpenses: -370, frustration: -15, carsOwned: -1 },
            result: "You junk it for $900 and return to full-time subway life. The subway improved since the nightmare '80s. You're in NYC - you don't NEED a car. Freedom from car ownership feels amazing. Sold: $900.",
            flags: { soldCarGen2: true, hasCarGen2: false }
        },
        {
            text: "BUY A CHEAP BEATER",
            effects: { money: -2100, monthlyExpenses: -150, frustration: 15 },
            result: "Sell yours for $900, buy a $3,000 beater off Craigslist. It's ugly and smells weird but it runs. Way lower insurance. You're cutting costs while keeping wheels. It's not pretty but it's practical. Net: $2,100."
        }
    ]
}
];

const nycGen3Scenarios = [
    {
        year: 2002,
        title: "Generation 3: Fresh Out of College",
        narrative: "You just graduated with $28,000 in student loans. First job offer: $42,000/year in Manhattan. Your grandparents paid $60/month rent here ($784 today). You're looking at $1,200/month for a studio. The city survived the fiscal crisis. It's safer now. The subway works. But can you afford it on entry-level pay?",
        image: "images/nyc2002.jpg",
        fact: {
            text: "In 2002, average Manhattan rent was $2,530/month while median income was $47,030. The gap was widening.",
            link: "https://www.6sqft.com/visualizing-50-years-of-rent-increases-in-nyc-vs-income-growth/"
        },
        choices: [
            {
                text: "Start Generation 3 in post-9/11 New York",
                effects: { monthlySalary: 5200, monthlyExpenses: 2500 },
                result: "You're 22 with a degree and debt. Your grandparents thrived here on factory wages, but times have drastically changed. You're trying to make it work in the recovering city. Welcome to 2002."
            }
        ]
    },

    {
        year: 2003,
        title: "The Apartment Hunt",
        narrative: "Where do you live? East Village: $1,400/month (close to everything, very cool). Astoria: $1,100/month (Greek food, N train). Williamsburg: $1,200/month (artists, the L train). Jersey City: $950/month with PATH (but it's Jersey). Parents' Long Island house: free (car required, age 22 living at home).",
        image: "images/apartmenthunting.gif",
        choices: [
            {
                text: "EAST VILLAGE",
                effects: { money: -2800, monthlyExpenses: 700, frustration: 10 },
                result: "East Village for $1,400. That's 40% of pre-tax income. You're eating dollar pizza but walking to everything. Broke but urban. Moving: $2,800.",
                flags: { livingInCity: true }
            },
            {
                text: "ASTORIA",
                effects: { money: -2200, monthlyExpenses: 500, frustration: 10 },
                result: "Astoria for $1,100. Amazing souvlaki, farther from Manhattan nightlife. The N train works. You can actually save money. Moving: $2,200.",
                flags: { livingInCity: true }
            },
            {
                text: "WILLIAMSBURG",
                effects: { money: -2400, monthlyExpenses: 600, frustration: 10 },
                result: "Williamsburg for $1,200. Artists everywhere. Warehouse parties. The L train is your lifeline. This neighborhood is about to explode. You're early. Moving: $2,400.",
                flags: { livingInCity: true }
            },
            {
                text: "PARENTS' HOUSE",
                effects: { money: -12000, monthlyExpenses: 450, frustration: 25, carsOwned: 1 },
                result: "You move home, buy a car. No rent but mom is always asking where you are. You're commuting to Manhattan on the LIRR. Car: $12,000.",
                flags: { livingWithParents: true, hasCarGen3: true, movedToSuburbs: true }
            }
        ]
    },
    {
                year: 2003,
                title: "Your Parents Need Their Cars",
                narrative: "You need to get to work every day. Your parents both use their cars for their own jobs. You take the LIRR, but they're sick of getting up early to drive you to the station. You need your own transportation, or you need to move out somewhere closer to work. Fast.",
                image: "images/geturcar.gif",
                requiresFlag: "livingWithParents",
                choices: [
                    {
                        text: "BUY A USED CAR",
                        effects: { money: -12000, monthlyExpenses: 600, frustration: -10, carsOwned: 1 },
                        result: "You buy a used car with 60,000 miles on it. Down payment eats $3,000 of your savings. Monthly breakdown: car payment $300, insurance $250, gas $135, food and everything else $700. At least you can reliably get to work now. Living with your parents in the suburbs basically requires having a car.",
                        flags: { hasCar: true }
                    },
                    {
                        text: "MOVE TO THE CITY",
                        effects: { money: -2800, monthlyExpenses: 2700, frustration: -15 },
                        result: "You find a studio apartment downtown and sign the lease that same day. First month, last month, and security deposit completely wipe out $2,800 of your savings. But now you can walk to work every morning. No car needed. You're broke but you're finally independent.",
                        flags: { livingWithParents: false, livingDowntown: true }
                    }
                ]
            },
        {
        year: 2006,
        title: "Time to go",
        narrative: "You're still living in your childhood bedroom. You tried to bring a date back last week and your mom offered them cookies. THE POKEMON POSTERS ARE STILL UP. Your parents are wonderful but its time to live on your own. You're moving out. The only question is where.",
        image: "images/pokemonroom.jpg",
        requiresFlag: "livingWithParents",
        choices: [
        {
            text: "MOVE DOWNTOWN",
            effects: { money: -2800, monthlyExpenses: 1100, frustration: -20, carsOwned: -1 },
            result: "You find a studio downtown. First, last, security deposit: $2,800 gone. You can walk to work and bars. You're broke but finally FREE. No more explaining the Pokemon posters. Moving: $2,800.",
            flags: { livingWithParents: false, livingDowntown: true, hasCarGen3: false, soldCarGen3: true }
        },
        {
            text: "MOVE TO QUEENS",
            effects: { money: -2600, monthlyExpenses: 1450, frustration: -20 },
            result: "You find a place in Astoria. Keep the car for Long Island visits and weekend trips. First, last, security: $2,600. You can have people over! Cook your own food! Be an adult! Your dignity is restored. Moving: $2,600.",
            flags: { livingWithParents: false, livingInCity: true }
        },
        {
            text: "MOVE TO BROOKLYN",
            effects: { money: -2400, monthlyExpenses: 1150, frustration: -20 },
            result: "You find two roommates in Bushwick. Your share is $1,000. Keep the car for flexibility. Moving costs: $2,400. You have roommates now instead of parents. It's loud and messy but it's YOUR loud and messy. Freedom achieved. Moving: $2,400.",
            flags: { livingWithParents: false, livingInCity: true }
        },
        {
            text: "JERSEY CITY",
            effects: { money: -2200, monthlyExpenses: 800, frustration: -15, carsOwned: -1 },
            result: "You cross the river to Jersey City for $1,100. Sell the car - don't need it with PATH access. Your address is New Jersey but you're INDEPENDENT. No more mom doing laundry. No more dad asking questions. You're free. Moving: $2,200.",
            flags: { livingWithParents: false, livingInCity: true, hasCarGen3: false, soldCarGen3: true }
        }
    ]
    },
    {
    year: 2008,
    title: "The Great Recession",
    narrative: "September 2008. The economy EXPLODED. Lehman Brothers gone. Your company doing layoffs. You're 27 and the economy is collapsing right as you're building your career. If you have a car, it's bleeding money. If you're in the city, you have options. If you're in suburbs, you're trapped. The Great Recession is destroying millennials.",
    image: "images/crisis.jpg",
    choices: [
        {
            text: "SELL CAR IMMEDIATELY",
            requiresFlag: "hasCarGen3",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: 4500, monthlyExpenses: -520, frustration: 20, carsOwned: -1 },
            result: "You're in the city so you CAN sell. Back to subway. Pride hurts but finances saved. The car was a luxury your generation couldn't afford. Sold: $4,500.",
            flags: { soldCarGen3: true, hasCarGen3: false }
        },
        {
            text: "KEEP CAR FOR JOB HUNTING MOBILITY",
            requiresFlag: "hasCarGen3",
            effects: { money: -220, frustration: 20 },
            result: "You keep it for interviews across the region. Mobility could mean staying employed. You're betting on the car while your budget screams. Costs: $220."
        },
        {
            text: "DOWNGRADE TO A CHEAPER BEATER",
            requiresFlag: "hasCarGen3",
            effects: { money: 2500, monthlyExpenses: -180, frustration: 10 },
            result: "Sell for $7,000, buy beater for $4,500. Way lower insurance. You look broke because you ARE. But you're surviving with wheels. Net: +$2,500."
        },
        {
            text: "MOVE TO A WAY CHEAPER APARTMENT",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -2200, monthlyExpenses: -450, frustration: 25 },
            result: "You flee your nice place for another place deep in Queens. Practically on the border. Rent drops from $1,800 to $1,100. Further from everything, rougher, but you're saving $700/month. Survival mode. Moving: $2,200."
        },
        {
            text: "GET A WEEKEND SIDE HUSTLE",
            effects: { money: 400, monthlyExpenses: -400, frustration: 25 },
            result: "You bartend weekends for extra $400/month. You're working 60 hours a week now. Social life: dead. Energy: gone. Bank account: stabilized. Monthly income: +$400."
        },
        {
            text: "ASK PARENTS FOR A LOAN",
            effects: { money: 3000, frustration: 20 },
            result: "You call your parents and ask for help. They loan you $3,000. You're grateful and humiliated simultaneously. They're worried about you. You promise to pay them back. The recession is breaking your generation. Loan: $3,000."
        },
        {
            text: "FREELANCE ON THE SIDE",
            effects: { money: 300, monthlyExpenses: -300, frustration: 20 },
            result: "You start freelancing nights and weekends. Graphic design, writing, whatever pays. Extra $300/month but you're exhausted constantly. Your generation has to have multiple income streams just to survive. Monthly freelance: +$300."
        }
    ]
    },
    {
        year: 2012,
        title: "Weekend in the Hamptons",
        narrative: "College friend is inviting you to their house in the Hamptons. Very fancy. Very far. It's 100 miles east. You can take the LIRR to somewhere then... cab? Take the bus? Rent a car for the weekend? Carpool with friends who have cars? Or skip it? You could use a nice relaxing weekend though...",
        image: "images/hamptons.jpg",
        choices: [
            {
                text: "RENT A CAR FOR THE WEEKEND",
                requiresNoFlag: "hasCarGen3",
                effects: { money: -280, frustration: 20 },
                result: "You rent a car Friday-Sunday. Drive out, tan, swim, drink, eat drive back. It works but $280 for one weekend away? This is why people buy cars - rental costs add up. Rental and other costs: $280."
            },
            {
                text: "LIRR THEN CAB",
                requiresNoFlag: "hasCarGen3",
                effects: { money: -150, frustration: 25 },
                result: "LIRR to the end of the line, cab from there. The logistics are harder than you thought. You're late to dinner. The return trip is a nightmare. Why do rich people have houses here? Train, cab, and other weekend espenses: $150."
            },
            {
                text: "DRIVE YOUR OWN CAR",
                requiresFlag: "hasCarGen3",
                effects: { money: -100, frustration: -15 },
                result: "You drive out Friday, enjoy the weekend, drive back Sunday. Easy. This is what the car is actually good for. You even offer to drive your car-free friends free of charge. Wow your a good friend. Gas and weekend expenses: $100."
            },
            {
                text: "CARPOOL WITH FRIENDS",
                effects: { money: -80, frustration: -5 },
                result: "You carpool with two friends. Split gas and tolls. But you're stuck on their exact schedule. Can't leave early, can't stay late. Your friend driving only has one CD: Some Nights by fun. Some nights you wish this would all end too...Your share and other weekend expenses $80."
            },
            {
            text: "TAKE THE HAMPTON JITNEY BUS",
            requiresNoFlag: "hasCarGen3",
            effects: { money: -95, frustration: 35 },
            result: "You take the Hampton Jitney because it's only $45 round trip. Then the bus gets delayed 40 minutes. The person next to you is eating some kind of fish situation out of Tupperware. The smell is AGGRESSIVE. You can't move seats - the bus is full. Bus ticket and other weekend expenses: $95."
            }, 
            {
                text: "SKIP IT",
                effects: { money: -30, frustration: 50 },
                result: "You skip the weekend in the hamptons. The transportation logistics are too much and you can't justify the extra costs. Your friends post about it on Instagram all weekend. You catch a bad case of FOMO. You order expensive chinese takeout to make yourself feel better."
            }
        ]
    },
{
    year: 2016,
    title: "Your Apartment Party Needs Wine",
    narrative: "You're throwing a wine party for 15 people. The wine shop near you charges $18/bottle (robbery). Trader Joe's has the same wine for $7/bottle. That's a $110 savings for 10 bottles! The problem? The nearest TJ's is 30 minutes away and you'll be carrying 10 glass bottles on a crowded Saturday subway, or Uber for $30 each way, or drive if you have a car. Why is hosting this hard?",
    requiresNoFlag: "movedToSuburbs",
    image: "images/wine.gif",
    choices: [
        {
            text: "TAKE THE SUBWAY CARRYING 10 BOTTLES",
            requiresNoFlag: "hasCarGen3",
            effects: { money: -105, frustration: 25 },
            result: "You take the subway to Union Square TJ's on Saturday afternoon. It's PACKED. You buy 10 bottles. The bags are absurdly heavy. You're dripping sweat. The train lurches and you almost fall. Everyone is staring. One bag rips. A bottle rolls down the car. You chase it. Humiliating. Wine and subway: $105."
        },
        {
            text: "UBER THERE AND BACK WITH THE WINE",
            requiresNoFlag: "hasCarGen3",
            effects: { money: -135, frustration: 15 },
            result: "You Uber to TJ's and back ($60 total). Your driver is blasting 'Closer' by the Chainsmokers on repeat. 'So baby pull me closer in the back seat of your Rover.'You tip extra because you like that song. Uber and wine: $135."
        },
        {
            text: "DRIVE YOUR CAR",
            requiresFlag: "hasCarGen3",
            effects: { money: -90, frustration: 15 },
            result: "You drive to the Queens TJ's. Easy! Load the trunk with wine and apps. Then you get back to your neighborhood and circle for 40 MINUTES looking for parking because everyone's home on Saturday. You finally find a spot 6 blocks away. Carry all the wine those 6 blocks. Wine and parking: $90."
        },
        {
            text: "JUST PAY THE EXPENSIVE LOCAL PRICES",
            effects: { money: -215, frustration: -10 },
            result: "You walk to the wine shop and pay $18/bottle. You're paying $110 extra to avoid ALL transportation logistics. But the party is already stressful and you have other things to worry about. Sometimes convenience is worth the money. Wine: $215."
        },
        {
            text: "ASK FRIEND WITH A CAR TO DRIVE YOU",
            requiresNoFlag: "hasCarGen3",
            effects: { money: -105, frustration: 10 },
            result: "You text your friend with a car: 'can u drive me to TJs pleeease 🙏🍷' They respond: 'ugh I don't feel like driving in the city rn.' You beg. They finally cave. You buy them Shake Shack after and feel like the world's biggest burden. Wine and food: $105."
        },
        {
            text: "GET WINE DELIVERED ONLINE",
            effects: { money: -165, frustration: -15 },
            result: "You order wine delivery. Marked up to $12/bottle plus delivery fee plus tip. But it shows up at your door in an hour. Worth it (kinda). Delivered wine: $165."
        },
        {
            text: "CANCEL THE PARTY",
            effects: { money: 0, frustration: 60 },
            result: "You cancel the entire party. Text everyone 'sorry something came up'. The wine logistics broke your spirit. Your friends are confused and annoyed. You spend Saturday night alone eating the expensive cheese you already bought and drinking one bottle by yourself."
        }
    ]
    },
    {
        year: 2018,
        title: "Hinge Date",
        narrative: "You matched on Hinge. Great conversation. They suggest drinks on the Upper West Side. You calculate the trip probably 25-40 minutes by subway depending on where you live and which trains are running. Or Uber for $35 each way. You're excited about them but exhausted from work. Why is dating this complicated?",
        image: "images/hinge.gif",
        choices: [
            {
                text: "SUBWAY THERE",
                requiresNoFlag: "hasCarGen3",
                effects: { money: -45, frustration: 25 },
                result: "You go down to the subway platform and see the train you need isn't coming for another 15 minutes... You text frantically. Show up 15 minutes late. They're annoyed and already half-done with their drink. Great start!"
            },
            {
                text: "UBER BOTH WAYS",
                effects: { money: -115, frustration: -5 },
                result: "You Uber both ways ($70). Date is good but this is expensive. They keep suggesting far places. Dating without a car costs money. This isn't sustainable. Date and rides: $115."
            },
            {
                text: "DRIVE",
                requiresFlag: "hasCarGen3",
                effects: { money: -75, frustration: -10 },
                result: "You drive. Find parking after 25 minutes. Parking garage $30 UGH. But the date is great. They're impressed you have a car. You offer to drive them home. Getting stuck in traffic prolongs the date and you both have a lot of fun. Parking and drinks: $75."
            },
            {
                text: "SUGGEST MEETING CLOSER TO YOU",
                effects: { frustration: 20 },
                result: "You counter with somewhere near you. They say that's 50 minutes from them. You're in the same city but geographically incompatible. Conversation dies. Transit killed this one."
            },
            {
                text: "CANCEL",
                effects: { frustration: 50 },
                result: "You cancel. Too exhausted to travel after work. Order Seamless, watch Netflix alone. Car dependency killed spontaneity. You stay home. Dating requires energy you don't have."
            }
        ]
    },
        {
        year: 2019,
        title: "Best Friend's Boston Wedding",
        narrative: "Your best friend is getting married in Boston. Transportation options are all terrible. Fly from LaGuardia: $540 (1.5 hours). Fly from Newark: $410 (getting there without a car sucks). Amtrak: $340 (4.5 hours). Drive: $220 in gas (5 hours in traffic). Chinatown bus: $75 (5.5 hours of suffering). This is American transportation in 2024.",
        image: "images/boston.jpg",
        choices: [
            {
                text: "PUBLIC TRANSIT TO NEWARK, FLY",
                requiresNoFlag: "hasCarGen3",
                effects: { money: -460, frustration: 20 },
                result: "NJ Transit to Newark to save $130. Connection adds 90 minutes. You're annoyed before boarding. Train and flight: $460."
            },
            {
                text: "DRIVE TO NEWARK, FLY",
                requiresFlag: "hasCarGen3",
                effects: { money: -650, frustration: 20 },
                result: "Drive to Newark, park long-term, fly 45 minutes. Car makes airports accessible. Parking ain't cheap. Parking and flight: $650."
            },
            {
                text: "UBER TO NEWARK, FLY",
                effects: { money: -525, frustration: 20 },
                result: "Uber to Newark. Driver grabs your bag. 45-minute flight. Easy. Expensive. The American way. Uber and flight: $525."
            },
            {
                text: "TAKE AMTRAK",
                effects: { money: -340, frustration: 35 },
                result: "Amtrak. Four and a half hours EACH WAY. Nine hours of travel for a weekend. American rail is embarrassing compared to Europe. Your attendance IS the gift. Train: $340."
            },
            {
                text: "DRIVE THERE",
                requiresFlag: "hasCarGen3",
                effects: { money: -220, frustration: 25 },
                result: "Five hours through I-95 traffic. Friday is driving. Sunday is driving. Ten hours of your weekend in a car on highways. Wedding is beautiful but commute destroyed you. Gas and tolls: $220."
            },
            {
                text: "GREYHOUND BUS",
                requiresNoFlag: "hasCarGen3",
                effects: { money: -90, frustration: 35 },
                result: "Greyhound. $35 each way. Five and a half hours. Seat next to bathroom. Door keeps hitting you. What happened in there... you don't want to know. Bus and gift: $90."
            },
            {
                text: "SKIP THE WEDDING",
                effects: { money: -60, frustration: 75 },
                result: "You skip it. Can't justify cost, time, or hassle. You send a gift and apologize. They're hurt you're not coming. What kind of friend are you? Gift: $60."
            }
        ]
    },
    {
        year: 2020,
        title: "COVID: The Great Escape",
        narrative: "March 2020. Pandemic. Remote work means location doesn't matter. Streets are empty. Do you go somewhere or stay?",
        image: "images/nyccovid.jpg",
        choices: [
            {
                text: "FLEE UPSTATE",
                effects: { money: -3000, monthlyExpenses: 150, frustration: -20},
                result: "You rent upstate in nature. Totally off the grid. Work remotely in peace. You sit by the fireplace everynight and you've watched every new Netflix original show. Renting cabin upstate and Netflix subscription: $3200.",
                flags: { hasCarGen3: true, movedToSuburbs: true }
            },
            {
                text: "STAY IN THE CITY",
                requiresNoFlag: "movedToSuburbs",
                effects: { money: -2600, frustration: 35 },
                result: "The streets are empty. It's erie!! But you know life will come back. You spend your days in your apartment learning new TikTok dances and making whipped coffee. It's getting a little lonely though.... Lease: $2,600."
            },
            {
                text: "DRIVE TO PARENTS",
                requiresFlag: "hasCarGen3",
                effects: { money: -400, frustration: -10 },
                result: "You load the car and quarantine at parents' suburban house. Car gave you escape options. Now you're stuck at your parents house for who knows how long. Your mom won't stop talking about the Tiger King. They pay for the groceries. Gas: $400."
            },
            {
                text: "ASK PARENTS TO COME PICK YOU UP",
                requiresNoFlag: "hasCarGen3",
                effects: {frustration: 30 },
                result: "You call your parents to see if they could pick you up to quarantine with them. Your mom is not happy: 'Don't you know how bad COVID is in the city??? We're not driving to the city!!' We'll see you when this whole thing blows over.' Looks like you're staying alone in the city."
            },
            {
                text: "STAY IN THE SUBURBS",
                requiresFlag: "movedToSuburbs",
                effects: { money: -300, frustration: 5 },
                result: "You're already in the suburbs with your car. You drive to parks, drive to pick up food safely, drive when you're bored, drive when you're happy, drive when you're sad. Geez you do a lot of driving. Get a hobby maybe. Gas: $300"
            },
            {
                text: "STAY WITH FRIENDS",
                requiresNoFlag: "movedToSuburbs",
                effects: {monthlyExpenses: -700, frustration: 30 },
                result: "You move in with two friends to split rent and survive together. Your friend leaves their dirty socks around the apartment. This is fine. Everything's fine. Sometimes you cry in the shower. You've been in the shower too long and now your roomate is banging on the bathroom door."
            }
        ]
    },
{
    year: 2021,
    title: "Hybrid Work Changes Everything",
    narrative: "Your company announces return to office - but only TWO days a week. Hybrid forever. This changes the geography calculation completely. Do you really need to live close to the office if you're only going in twice a week? Could you move somewhere cheaper and just deal with the commute two days? Or find a fully remote job and live ANYWHERE? The pandemic broke all the old rules.",
    image: "images/backtowork.jpg",
    choices: [
        {
            text: "MOVE WAY FURTHER OUT",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -3500, monthlyExpenses: -600, frustration: 30 },
            result: "You move to the far reaches of Queens where rent is $1,200 instead of $1,800. Your commute is 90 minutes on office days but you only suffer through it TWICE a week. You're saving $600/month. The hybrid math actually works. Moving: $3,500."
        },
        {
            text: "STAY WHERE YOU ARE",
            effects: { money: 0, frustration: 20 },
            result: "You stay put. Yeah you're only going in twice a week but you like where you're at right now. Close to friends, bars, you know your area well and you're happy. No need to change anything."
        },
        {
            text: "MOVE TO SUBURBS",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -18000, monthlyExpenses: 200, frustration: 15, carsOwned: 1 },
            result: "You move to Jersey and buy a car. Rent drops to $1,400. You drive to PATH station twice a week. The other three days you work from home. Hybrid work made suburban life possible. Maybe you should get a dog. Name him Snoopy. Moving and car: $18,000.",
            flags: { movedToSuburbs: true, hasCarGen3: true }
        },
        {
            text: "QUIT AND FIND FULLY REMOTE JOB",
            effects: { money: -1500, frustration: 25 },
            result: "You are not giving up zoom meetings in your PJs. You job hunt for fully remote positions. Two months of applications and Zoom interviews. You find one with same pay, zero commute EVER. You could live anywhere now. The possibilities are wild. Job hunt costs: $1,500."
        },
        {
            text: "ASK YOUR BOSS TO GO FULLY REMOTE",
            effects: { money: 0, frustration: 15 },
            result: "You ask your boss if you can just go fully remote since you're only in twice a week anyway. They say 'No, we need the team collaboration.' You point out you're on Zoom the whole time you're in the office. They don't care. Request denied."
        },
    ]
    },
    {
        year: 2023,
        title: "Parents Retired to the Catskills",
        narrative: "Your parents retired upstate. Two hours north in the mountains. They want you visiting every other weekend for family time. Options: Amtrak + Uber is $180 round trip. Rent ZIP Car for $140 the weekend. Buy a car for $600/month forever. Or visit monthly and handle the guilt. Family obligations meet infrastructure.",
        image: "images/catskills.jpg",
        choices: [
            {
                text: "BUY A CAR FOR FAMILY VISITS",
                requiresNoFlag: "hasCarGen3",
                requiresNoFlag: "movedToSuburbs",
                effects: { money: -30000, monthlyExpenses: 640, frustration: -10, carsOwned: 1 },
                result: "You buy a car specifically for visiting family. Now you can go whenever. But paying $640/month (parking in Brooklyn is $350!) for a car you use twice monthly. Family geography bought this car. Monthly: $640.",
                flags: { hasCarGen3: true }
            },
            {
                text: "AMTRAK + UBER",
                effects: { money: -360, monthlyExpenses: 360, frustration: 25 },
                result: "Amtrak then Uber from the station. $180 per visit. Less than owning but still $4,320/year. You're car-free but stuck on train schedules. Monthly: $360."
            },
            {
                text: "RENT CAR FOR VISITS",
                requiresNoFlag: "hasCarGen3",
                effects: { money: -280, monthlyExpenses: 280, frustration: 10 },
                result: "You rent twice monthly. $140 per weekend. Flexibility without ownership. Still $3,360/year. You're constantly calculating if this is cheaper than owning. Probably? Monthly: $280."
            },
            {
                text: "DRIVE WHENEVER",
                requiresFlag: "hasCarGen3",
                effects: { money: -75, frustration: -5 },
                result: "You drive upstate whenever. Parents are thrilled. Spontaneous visits! Weekday dinners! Car makes family easy. This is what it's for. Gas monthly: $75."
            },
        ]
    },
    {
    year: 2024,
    title: "Subway Floods When It Rains Now",
    narrative: "Heavy rain warning on your phone. The subway floods when it rains hard. The MTA spent $5 billion but stations still flood. Service stops. You're checking weather apps before commuting. Climate change meets aging infrastructure. Do you finally buy a car as flood insurance?",
    requiresNoFlag: "hasCarGen3",
    requiresNoFlag: "movedToSuburbs",
    image: "images/subwayflood.jpg",
    fact: {
        text: "Post-Sandy, the subway remains vulnerable to flooding from heavy rain despite $5 billion in repairs.",
        link: "https://www.progressiverailroading.com/passenger_rail/article/Hurricane-Sandy-Four-years-later-New-York-City-Transit-is-still-fixing-fortifying-the-rail-system--49988"
    },
    choices: [
        {
            text: "BUY CAR AS CLIMATE INSURANCE",
            effects: { money: -29000, monthlyExpenses: 680, frustration: 25, carsOwned: 1 },
            result: "Climate change pushed you into car ownership. Subway floods regularly now. You need backup transportation. You buy a car you'll barely use just for flood days and weekends. This is the new reality. Welcome to the future. Monthly: $680.",
            flags: { hasCarGen3: true }
        },
        {
            text: "KEEP RIDING - WFH ON FLOOD DAYS",
            effects: { money: -90, frustration: -10 },
            result: "You keep riding. Most days it works fine. Flood days you work from home or Uber. The subway is still cheaper than car ownership even with occasional flooding. You're adapting to climate change without buying a car. Flood day Ubers: $90."
        },
        {
            text: "BUY E-BIKE",
            effects: { money: -2800, frustration: -5 },
            result: "You buy an e-bike. Bikes don't flood! You're climate-adapting without car dependency. You show up to work drenched on rainy days but you're mobile in ANY weather. Your coworkers think you're completely insane. E-bike: $2,800."
        },
        {
            text: "CITIBIKE MEMBERSHIP",
            effects: { money: -220, monthlyExpenses: 18, frustration: 10 },
            result: "You get CitiBike annual membership as flood-day backup. Stations everywhere! Except when there's no bikes. Or no docks. Or it's pouring rain. You still end up Ubering on actual flood days. Annual: $220."
        },
        {
            text: "JUST ACCEPT THE FLOODING. NOT EVERYTHING CAN BE PERFECT",
            effects: { money: 0, frustration: -5 },
            result: "You just... deal with it. Check weather every morning. Plan around rain forecasts. Work from home when it floods. This is climate change in a coastal city. You're adapting to the new normal without buying anything."
        }
    ]
    },
    {
    year: 2025,
    title: "Congestion Pricing Just Made Your Car Expensive",
    narrative: "After DECADES of fighting, NYC implements congestion pricing. Driving into Manhattan below 60th Street now costs $9-15 per trip. You have a car in the city. Your monthly costs are about to EXPLODE. $15 toll every time you drive to work below 60th. That's $300/month for 20 commutes on top of your already insane parking and insurance. The city just made car ownership way more expensive. What do you do?",
    requiresFlag: "hasCarGen3",
    image: "images/congestionzone.jpg",
    fact: {
        text: "NYC's congestion pricing launched January 2025 - first in the US. Expected to reduce traffic by 17% and generate $15 billion for subway improvements.",
        link: "https://www.nbcnewyork.com/news/congestion-pricing-is-back-breakdown-new-pricing/5985267/"
    },
    choices: [
        {
            text: "KEEP DRIVING",
            effects: { money: -400, monthlyExpenses: 400, frustration: 10 },
            result: "You keep driving to work in Manhattan. $15 every time you cross 60th Street. That's $300/month for 20 commutes PLUS your $600 parking PLUS insurance PLUS gas. You're paying over $1,500/month just to own and use a car in NYC now. This is insane. Monthly toll: $400."
        },
        {
            text: "SELL THE CAR",
            effects: { money: 14000, monthlyExpenses: -1040, frustration: -10, carsOwned: -1 },
            result: "Congestion pricing plus parking plus insurance is TOO MUCH. You sell and go full-time subway. The city finally made car ownership financially impossible. You're actually relieved. Victory for transit. Freedom for you. Sold: $14,000.",
            flags: { soldCarGen3: true, hasCarGen3: false }
        },
        {
            text: "WORK FROM HOME MORE",
            effects: { money: 0, frustration: 20 },
            result: "You start working from home way more to avoid both the commute AND the toll. Your boss notices you're never in the office anymore. They're not thrilled about it. You get a bad review at the end of the year."
        },
        {
            text: "MOVE TO A JOB OUTSIDE THE CONGESTION ZONE",
            effects: { money: -1200, frustration: -5 },
            result: "You job hunt specifically for positions above 60th Street or in Brooklyn to escape the toll zone. You find one after two months. Same pay, no toll. You restructured your career around a traffic policy. Job hunt: $1,200."
        },
        {
            text: "PARK OUTSIDE ZONE, SUBWAY IN",
            effects: { money: -200, monthlyExpenses: 200, frustration: 10 },
            result: "You drive to 61st Street, park there for $400/month (still expensive but less than downtown), then subway the rest. You're gaming the system. It's annoying and time-consuming but cheaper than the toll. Monthly parking: $200 extra."
        }
    ]
    },
       {
        year: 2025,
        title: "Can You Even Afford the New York area?",
        narrative: "Rent just hit $2,800/month. That's 61% of take-home pay. Officially 'severely rent-burdened.' Savings: empty. One emergency from disaster. But you're in New York without a car. That's worth something. Right? Your grandparents afforded this on $300/month ($3,900 today). You barely afford it making $58,000. Can you stay?",
        image: "images/expensive.gif",
        choices: [
            {
                text: "STAY IN NYC",
                requiresNoFlag: "movedToSuburbs",
                effects: { money: -1400, frustration: 5 },
                result: "You renew. Barely making it but STAYING. Your grandparents made it on factory wages. You barely make it with a degree. The system broke somewhere. But you're not leaving. Renewal: $1,400."
            },
            {
                text: "MOVE TO PHILADELPHIA",
                effects: { money: -3800, monthlyExpenses: -1100, frustration: 10 },
                result: "You move to Philly. Rent is $1,400 for twice the space. You can save and breathe. But you LEFT NEW YORK. Affordability won. You failed to hold on. Friends say they'll visit. They won't. Moving: $3,800."
            },
            {
                text: "MOVE TO SUBURBS",
                requiresNoFlag: "movedToSuburbs",
                effects: { money: -21000, monthlyExpenses: 350, frustration: 15, carsOwned: 1 },
                result: "You retreat to New Jersey. Rent drops to $1,600 but you need a car IMMEDIATELY for everything. Priced out of NYC and pushed into car dependency at once. The double defeat. Moving and car: $21,000.",
                flags: { movedToSuburbs: true, hasCarGen3: true }
            },
            {
                text: "STAY IN SUBURBS",
                requiresFlag: "movedToSuburbs",
                effects: { money: 0, frustration: 10 },
                result: "You're in suburbs where rent is $1,400. Affordable. You need the car but housing isn't crushing you. You left years ago. Different trade-offs."
            },
            {
            text: "IT'S COLD HERE, IT'S BUSY HERE. MOVE TO FLORIDA",
             effects: { money: -8000, monthlyExpenses: -400, frustration: 10, carsOwned: 1 },
            result: "You flee to Tampa. Rent is $1,200 for a 2-bedroom with PARKING. No state income tax! Sunshine! But you need a car for literally everything. There's no sidewalks. You're driving to get your mail. You joined the mass NYC-to-Florida migration and traded unaffordable walkability for affordable car dependency. Moving and car down payment: $8,000.",
            flags: { movedToSouth: true, hasCarGen3: true }
            },
            {
            text: "MOVE IN WITH PARTNER",
            effects: { money: -2400, monthlyExpenses: -1000, frustration: 20 },
            result: "You move in with partner. Split a $2,000 place. Staying in NYC by combining incomes. Relationship escalated by rent crisis. Very romantic. Very necessary. Moving: $2,400."
            }
        ]
    },
    {
        year: 2025,
        title: "Looking Back at 75 Years",
        narrative: "Three generations. Grandparents: $60 rent ($784 today), 10¢ subway ($1.31 today), car optional. Parents: fiscal crisis, burning trains, suburban flight. You: $2,800 rent, $2.90 subway, $3.00 starting in 2026. Transit still exists. You still don't NEED a car. But can you afford car-free life? That's the question.",
        image: "",
        choices: [
            {
                text: "FINISH YOUR JOURNEY",
                effects: { money: 0, frustration: 0 },
                result: "75 years of NYC. Transit still exists. You still don't technically need a car. But the city got so expensive that car-free living became a luxury only the rich, desperate, or deeply committed can afford. Was this choice or economics forcing your hand?"
            }
        ]
    }
];
scenarios.nyc = {
    gen1: nycGen1Scenarios,
    gen2: nycGen2Scenarios,
    gen3: nycGen3Scenarios,
};
const inflationMultipliers = {
};

function getInflationMultiplier(year) {
    const years = Object.keys(inflationMultipliers).map(Number).sort((a, b) => a - b);
    for (let i = years.length - 1; i >= 0; i--) {
        if (year >= years[i]) return inflationMultipliers[years[i]];
    }
    return 1.0;
}

function startCharacterCreation() {
    document.getElementById('front-page').classList.remove('active');
    document.getElementById('character-creation').classList.add('active');
    updateCharacterPreview();
}

function updateCharacterPreview() {
    const firstName = document.getElementById('first-name').value || 'John';
    const lastName = document.getElementById('last-name').value || 'Doe';
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const job = document.querySelector('input[name="job"]:checked').value;
    
    const genderEmojis = { male: '👨', female: '👩', nonbinary: '🧑' };
    const jobNames = { factory: 'Factory Worker', teacher: 'Teacher', public: 'Public Worker' };
    
    document.getElementById('character-sprite').textContent = genderEmojis[gender];
    document.getElementById('preview-name').textContent = `${firstName} ${lastName}`;
    document.getElementById('preview-job').textContent = jobNames[job];
}

document.getElementById('first-name')?.addEventListener('input', updateCharacterPreview);
document.getElementById('last-name')?.addEventListener('input', updateCharacterPreview);
document.querySelectorAll('input[name="job"]').forEach(radio => {
    radio.addEventListener('change', updateCharacterPreview);
});
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', updateCharacterPreview);
});

function nextScreen() {
    gameState.character.firstName = document.getElementById('first-name').value || 'John';
    gameState.character.lastName = document.getElementById('last-name').value || 'Doe';
    gameState.character.gender = document.querySelector('input[name="gender"]:checked').value;
    gameState.character.job = document.querySelector('input[name="job"]:checked').value;
    
    gameState.monthlySalary = jobSalaries[gameState.character.job];
    
    document.getElementById('character-creation').classList.remove('active');
    document.getElementById('city-selection').classList.add('active');
}

function selectCity(city) {
    document.querySelectorAll('.city-card').forEach(card => card.classList.remove('selected'));
    event.target.closest('.city-card').classList.add('selected');
    gameState.city = city;
    
    const cityInfo = {
        nyc: { name: 'NEW YORK CITY', desc: 'The city that never sleeps. The BIG APPLE! Here walking can be faster than driving. How will you navigate its rapidly changing infrastructure?' },
        detroit: { name: 'DETROIT', desc: 'The Motor City. Streetcars still run everywhere in 1950. But the auto industry is about to reshape absolutely everything.' },
        la: { name: 'LOS ANGELES', desc: 'The city of angels. The Red Cars connect the beaches to the mountains. But car culture is rising fast.' }
    };
    
    document.getElementById('selected-city-name').textContent = cityInfo[city].name;
    document.getElementById('selected-city-desc').textContent = cityInfo[city].desc;
    document.getElementById('city-info').style.display = 'block';
}
function startGame() {
    document.getElementById('city-selection').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('game-meters').style.display = 'flex';
    document.getElementById('skip-button').style.display = 'block'; // Show skip button
    updateGameStats();
    loadScenario();
}

function skipToEnd() {
    if (confirm('Skip to the end and see your results? You\'ll miss the rest of the story!')) {
        showEndScreen();
    }
}
function updateGameStats() {
    document.getElementById('money').textContent = Math.round(gameState.money).toLocaleString();
    document.getElementById('cars-owned').textContent = gameState.carsOwned;
    const frustrationPercent = Math.min(100, Math.max(0, gameState.frustration));
    document.getElementById('frustration-fill').style.width = frustrationPercent + '%';
}

function animateMoney(oldMoney, newMoney) {
    const moneyEl = document.getElementById('money');
    const diff = newMoney - oldMoney;
    const duration = 1500;
    const steps = 40;
    const stepValue = diff / steps;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
        currentStep++;
        const currentValue = oldMoney + (stepValue * currentStep);
        moneyEl.textContent = Math.round(currentValue).toLocaleString();
        if (currentStep >= steps) {
            clearInterval(interval);
            moneyEl.textContent = Math.round(newMoney).toLocaleString();
        }
    }, stepTime);
}

function loadScenario() {
    const genKey = `gen${gameState.currentGeneration}`;
    let cityScenarios = [...scenarios[gameState.city][genKey]];
    
if (gameState.currentGeneration === 1 && (gameState.city === 'detroit' || gameState.city === 'nyc')) {
    const jobScenario = gameState.city === 'detroit' ? 
        jobSpecificScenarios[gameState.character.job] : 
        jobSpecificScenariosNYC[gameState.character.job];
    const jobIndex = cityScenarios.findIndex(s => s.title === "Job Scenario");
    if (jobIndex !== -1) {
        cityScenarios[jobIndex] = jobScenario;
    }
}
    
    if (!cityScenarios || gameState.currentScenarioIndex >= cityScenarios.length) {
        if (gameState.currentGeneration < 3) {
            gameState.currentGeneration++;
            gameState.currentScenarioIndex = 0;
            loadScenario();
        } else {
            showEndScreen();
        }
        return;
    }
    
    const scenario = cityScenarios[gameState.currentScenarioIndex];
    
    if (scenario.requiresFlag && !gameState[scenario.requiresFlag]) {
        gameState.currentScenarioIndex++;
        loadScenario();
        return;
    }
    if (scenario.requiresNoFlag && gameState[scenario.requiresNoFlag]) {
        gameState.currentScenarioIndex++;
        loadScenario();
        return;
    }
    if (scenario.requiresForced && !gameState.forcedNextScenario) {
        gameState.currentScenarioIndex++;
        loadScenario();
        return;
    }
    if (scenario.requiresAnyCarOwned && gameState.carsOwned === 0) {
        gameState.currentScenarioIndex++;
        loadScenario();
        return;
    }
    
    const previousYear = gameState.currentYear;
    gameState.currentYear = scenario.year;
    const yearsElapsed = Math.floor(gameState.currentYear - previousYear);
    
    if (yearsElapsed > 0 && gameState.currentScenarioIndex > 0) {
        const inflationMult = getInflationMultiplier(gameState.currentYear);
        const oldInflationMult = getInflationMultiplier(previousYear);
        
        if (gameState.monthlySalary > 0) {
            gameState.monthlySalary = (gameState.monthlySalary / oldInflationMult) * inflationMult;
        }
        
        const annualIncome = gameState.monthlySalary * 12 * yearsElapsed;
        gameState.money += annualIncome;
        
        const annualExpenses = gameState.monthlyExpenses * 12 * yearsElapsed;
        gameState.money -= annualExpenses;
    }
    
    document.getElementById('current-year').textContent = Math.floor(scenario.year);
    document.getElementById('current-generation').textContent = `Generation ${gameState.currentGeneration}`;
    
    let narrativeText = scenario.narrative;
    if (scenario.title === "Welcome to Detroit" || scenario.title === "Welcome to New York City") {
    narrativeText = `${gameState.character.firstName}, ${scenario.narrative}`;
    }
    
 const narrativeEl = document.getElementById('narrative');

let factHTML = '';
if (scenario.fact) {
    factHTML = `
        <div class="fact-box-inline">
            <div class="fact-title">📚 DID YOU KNOW?</div>
            <div id="fact-content">${scenario.fact.text}</div>
            <a href="${scenario.fact.link}" target="_blank" class="fact-link">Read More →</a>
        </div>
    `;
}

if (scenario.image) {
    narrativeEl.innerHTML = `<div class="narrative-copy">${narrativeText}${factHTML}</div><img class="narrative-image" src="${scenario.image}" alt="${scenario.title}">`;
} else {
    narrativeEl.innerHTML = `<div class="narrative-copy">${narrativeText}${factHTML}</div>`;
}

document.getElementById('fact-box').style.display = 'none';
    
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    
    scenario.choices.forEach((choice) => {
        if (choice.requiresFlag && !gameState[choice.requiresFlag]) return;
        if (choice.requiresNoFlag && gameState[choice.requiresNoFlag]) return;
        if (choice.requiresAnyCarOwned && gameState.carsOwned === 0) return;
        
        const button = document.createElement('button');
        button.className = 'choice-button';
        if (choice.forcedChoice) button.classList.add('forced-choice');
        button.textContent = choice.text;
        button.onclick = () => makeChoice(scenario, choice);
        choicesContainer.appendChild(button);
    });
    
    gameState.forcedNextScenario = false;
    updateGameStats();
}

function makeChoice(scenario, choice) {
    const oldMoney = gameState.money;
    const inflationMult = getInflationMultiplier(gameState.currentYear);
    
    if (choice.effects.money) {
        if (choice.effects.jobMultiplier && gameState.character.job === 'factory') {
            gameState.money += choice.effects.money * 1.5 * inflationMult;
        } else {
            gameState.money += choice.effects.money * inflationMult;
        }
    }
    
    if (choice.effects.monthlyExpenses) {
        gameState.monthlyExpenses += choice.effects.monthlyExpenses * inflationMult;
    }
    
    if (choice.effects.monthlySalary) {
        if (choice.effects.monthlySalary > 1000) {
            gameState.monthlySalary = choice.effects.monthlySalary;
        } else {
            gameState.monthlySalary += choice.effects.monthlySalary * inflationMult;
        }
    }
    
    if (choice.effects.frustration) {
        gameState.frustration = Math.max(0, Math.min(100, gameState.frustration + choice.effects.frustration));
    }
    
    if (choice.effects.carsOwned) {
        gameState.carsOwned += choice.effects.carsOwned;
    }
    
    if (choice.flags) {
        Object.keys(choice.flags).forEach(flag => {
            gameState[flag] = choice.flags[flag];
        });
    }
    
    if (choice.forceNext) {
        gameState.forcedNextScenario = true;
    }
    
    showResultModal(choice, oldMoney, gameState.money);
}

function showResultModal(choice, oldMoney, newMoney) {
    const modal = document.createElement('div');
    modal.className = 'result-modal';
    
    const moneyDiff = newMoney - oldMoney;
    const moneyChangeHTML = moneyDiff !== 0 ? `
        <div class="money-change">
            <div class="money-animation ${moneyDiff < 0 ? 'money-spent' : 'money-gained'}">
                ${moneyDiff < 0 ? '-' : '+'}$${Math.abs(Math.round(moneyDiff)).toLocaleString()}
            </div>
            <div style="font-size: 8px; color: #6A1B9A;">New Balance: $${Math.round(newMoney).toLocaleString()}</div>
        </div>
    ` : '';
    
    const annualSalary = Math.round(gameState.monthlySalary * 12);
    const annualExpenses = Math.round(gameState.monthlyExpenses * 12);
    const netAnnual = annualSalary - annualExpenses;
    
    modal.innerHTML = `
        <div class="result-box">
            <div class="result-title">LETS SEE HOW YOUR JOURNEY WENT</div>
            <div class="result-text">${choice.result}</div>
            ${moneyChangeHTML}
            <div class="stat-summary">
                <div class="stat-row"><span>Current Cash:</span><span>$${Math.round(gameState.money).toLocaleString()}</span></div>
                <div class="stat-row"><span>Annual Income:</span><span style="color: #4CAF50;">+$${annualSalary.toLocaleString()}</span></div>
                <div class="stat-row"><span>Annual Expenses:</span><span style="color: #FF5722;">-$${annualExpenses.toLocaleString()}</span></div>
                <div class="stat-row"><span>Net Per Year:</span><span style="color: ${netAnnual >= 0 ? '#4CAF50' : '#FF5722'};">${netAnnual >= 0 ? '+' : ''}$${netAnnual.toLocaleString()}</span></div>
                <div class="stat-row"><span>Cars Owned:</span><span>${gameState.carsOwned}</span></div>
                <div class="stat-row"><span>Stress Level:</span><span>${Math.round(gameState.frustration)}%</span></div>
            </div>
            <button class="button" onclick="closeResultModal()">CONTINUE</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => {
        animateMoney(oldMoney, newMoney);
        updateGameStats();
    }, 300);
}

function closeResultModal() {
    document.querySelector('.result-modal')?.remove();
    gameState.currentScenarioIndex++;
    loadScenario();
}
function showEndScreen() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('game-meters').style.display = 'none';
    document.getElementById('skip-button').style.display = 'none';
    document.getElementById('end-screen').classList.add('active');
    
    const finalMoney = Math.max(0, gameState.money);
    const totalCars = gameState.choiceHistory.filter(c => c.effects?.carsOwned > 0).reduce((sum, c) => sum + c.effects.carsOwned, 0);
    
    const shareText = `I played HIGHWAY ROBBERY and survived 75 years in ${gameState.city.toUpperCase()}!\n\n💰 Final Cash: $${Math.round(finalMoney).toLocaleString()}\n🚗 Cars Owned: ${totalCars}\n😤 Stress: ${Math.round(gameState.frustration)}%\n\nWas it really choice or was I trapped by infrastructure? Play and find out!`;
    
    document.getElementById('final-summary').innerHTML = `
        <div style="font-size: 10px; line-height: 1.8;">
            <p><strong>${gameState.character.firstName} ${gameState.character.lastName}</strong> lived in <strong>${gameState.city.toUpperCase()}</strong> from 1950 to 2025.</p>
            <p style="margin-top: 20px;"><strong>FINAL STATS:</strong></p>
            <p>→ Ending Cash: $${Math.round(finalMoney).toLocaleString()}</p>
            <p>→ Total Cars Owned: ${totalCars}</p>
            <p>→ Final Stress Level: ${Math.round(gameState.frustration)}%</p>
            
<div class="share-section">
    <h4 style="text-align: center; margin: 25px 0 15px 0;">SHARE YOUR RESULTS:</h4>
    <div class="share-buttons">
        <button class="share-button twitter" onclick="shareToTwitter(\`${shareText.replace(/`/g, '\\`')}\`)">
            🐦 X/TWITTER
        </button>
        <button class="share-button facebook" onclick="shareToFacebook()">
            📘 FACEBOOK
        </button>
        <button class="share-button reddit" onclick="shareToReddit(\`${shareText.replace(/`/g, '\\`')}\`)">
            🤖 REDDIT
        </button>
        <button class="share-button copy" onclick="copyResults(\`${shareText.replace(/`/g, '\\`')}\`)">
            📋 COPY
        </button>
    </div>
    <p style="font-size: 6px; text-align: center; margin-top: 10px; color: #6A1B9A;">
        💡 TIP: Copy results to share on Instagram, TikTok, or anywhere!
    </p>
</div>
            
            <p style="margin-top: 30px; font-weight: bold; color: #6A1B9A;">So. Was It Really Choice?</p>
            <p>You made "choices" every generation. But did you really have choices?</p>
            <p>When transit was systematically eliminated, was it really a choice to buy a car?</p>
            <p>When jobs moved to car-only suburbs, was it really a choice to follow them?</p>
            <p>When your kid needed to get somewhere 12 miles away, was it really a choice to drive them?</p>
            <p style="margin-top: 20px;"><strong>The infrastructure determined your options before you ever got to decide.</strong></p>
            <p>American car dependency wasn't consumer preference. It was deliberate policy: corporations destroying transit, highway funding overwhelming transit funding, zoning laws requiring cars, urban renewal destroying walkable neighborhoods.</p>
            <p style="margin-top: 20px; font-weight: bold;">The average American spends $400,000-$500,000 on cars over their lifetime.</p>
            <p>That's a house. That's retirement. That's generational wealth.</p>
            <p>Instead, it became pure profit for car companies, oil companies, and insurance companies.</p>
            <p style="margin-top: 20px; font-weight: bold; color: #6A1B9A;">This game reveals the illusion of choice.</p>
            <p>Highway robbery isn't just a metaphor. It's what actually happened.</p>
        </div>
    `;
}
function shareToTwitter(text) {
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

function shareToFacebook() {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareToReddit(text) {
    const url = window.location.href;
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent('I played HIGHWAY ROBBERY - These are my results')}`;
    window.open(redditUrl, '_blank', 'width=700,height=500');
}

function copyResults(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Results copied! Paste into Instagram, TikTok or Send to your mom! Send to your grandma!! Send to your friends');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Results copied! Paste into Instagram, TikTok or Send to your mom! Send to your grandma!! Send to your friends');
    });
}

function showResources() {
    document.getElementById('end-screen').classList.remove('active');
    document.getElementById('resources-screen').classList.add('active');
}
