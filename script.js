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
    monthlyExpenses: 100,
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
            {
    year: 1950,
    title: "Welcome to Detroit",
    narrative: "You just moved to Detroit with $5,000 saved! Your apartment is downtown, $45 a month. The streetcar stops right outside and runs everywhere for a dime. Your partner works three blocks away. There's so much to do and explore. The city feels electric.",
    image: "images/steetcard.jpg",
    fact: {
        text: "In 1950, Detroit had one of America's most extensive streetcar systems. A ride cost 10¢. The city was at its peak population of 1.8 million.",
        link: "https://www.detroithistorical.org/learn/online-research/blog/detroits-streetcars-past-and-present"
    },
    choices: [
        {
            text: "EXPLORE THE CITY BY STREETCAR EVERY WEEKEND",
            effects: { money: -100, frustration: -10 },
            result: "Paradise Valley jazz clubs on Friday - Elvin Jones is just incredible. Belle Isle picnics on Saturday. Fox Theatre on Sunday to see All About Eve - AMAZING FILM. The streetcar takes you everywhere for a dime. Detroit's got 1.8 million people right now and the whole city feels alive. You're living in the center of American manufacturing and it RULES."
        },
        {
            text: "WORK OVERTIME AND STACK THAT MONEY",
            effects: { money: 200, frustration: 25, jobMultiplier: true },
            result: "Time and a half pays SUPER GOOD. Your savings are exploding. You're also seeing your apartment exclusively between the hours of 11pm and 6am. Your partner asks if you remember what they look like. Trouble in paradise...Your friends went to see the Lions beat the Rams but you were doing a double shift. Think of the money...think of the money..."
        },
        {
            text: "BALANCE WORK AND LIFE",
            effects: { money: 0, frustration: 0 },
            result: "You work your 40 hours. No more, no less. Friday nights at the Polish restaurants on Michigan Avenue - pierogis for DAYS. Sundays at Briggs Stadium watching the Lions (they're actually REALLY GOOD right now, absolutely enjoy this while it lasts). Motor City's got you purring."
        }
    ]
},
    {
        year: 1952,
        title: "Everyone's Buying Cars",
        narrative: "Cars are EVERYWHERE in your neighborhood now. Your neighbor Frank bought a new Chevy and won't shut UP about it - he's selling his old '48 Plymouth for $700. Everyone talks about their weekend drives up north. Your partner mentions their sister just bought one. Frank keeps revving his engine in the driveway at 7am. Frank, we GET IT.",
        image: "images/chrome.jpg",
        choices: [
            {
                text: "BUY FRANK'S OLD CAR",
                effects: { money: -700, monthlyExpenses: 55, frustration: -15, carsOwned: 1 },
                result: "The Plymouth runs great. You drive it to work Monday and feel POWERFUL. Gas is 20¢/gallon. Parking's free everywhere. Tuesday morning Frank's out there reving his Chevy at 7am as usual. You rev the Plymouth back. Frank LOSES IT laughing. Now you both rev your engines at each other every morning. The other neighbors hate both of you. You and Frank don't care - You're best buddies now. Monthly costs: $35.",
                flags: { hasCarGen1: true }
            },
            {
                text: "BUY BRAND NEW",
                effects: { money: -1400, monthlyExpenses: 95, frustration: -20, carsOwned: 1 },
                result: "You walk into the Dodge dealership on Woodward and the salesman practically CARRIES you to a shiny new Coronet. That new car smell hits different. You drive it to work Monday and three guys stop you in the parking lot to look at it. Frank sees it and goes SILENT. Wednesday morning he's revving his Chevy in the driveway. You rev the Coronet back. LOUDER. Frank revs again. You rev LOUDER. This goes on for five minutes. Your partner yells 'FOR THE LOVE OF GOD WILL BOTH OF YOU STOP' out the window. You and Frank are in a cold war now. Worth every penny. Monthly costs: $55.",
                flags: { hasCarGen1: true }
            },
            {
                text: "STICK WITH STREETCAR",
                effects: { money: 100, frustration: 15 },
                result: "Streetcars still run perfectly fine! You're saving HUNDREDS. But literally every lunch break is car talk now. Your partner says their sister and their partner took their new Buick up to Mt.Mancelona to ski. You respond 'Well that's like a three hour drive and I hate skiiing so sounds like an awful day that I would hate' Jeez simmer down... Also, Frank honks at you when he drives past you at the streetcar stop. You roll your eyes at him. He can be such an asshole."
            }
        ]
    },
    {
    year: 1954,
    title: "Anniversary Dinner",
    narrative: "Your anniversary is coming up. Your partner wants to go to this new restaurant that opened in the suburbs - everyone at work won't stop talking about it. It's 9 miles away. The bus takes 90 minutes with two transfers. The streetcar doesn't go there. What should you do?",
    image: "images/couplead.jpg",
    choices: [
        {
            text: "DRIVE THERE",
            requiresFlag: "hasCarGen1",
            effects: { money: -15, frustration: -15 },
            result: "You drive to the restaurant in 15 minutes flat. The food's incredible. Your partner's absolutely glowing. You drive home with the windows down, radio playing Sinatra. You pass a massive Cadillac billboard with a happy couple who look EXACTLY like you two right now. Your partner goes 'THAT'S US!' You feel like you're living in a car commercial and it feels AMAZING. Dinner and gas: $15."
        },
        {
            text: "TAKE THE BUS",
            requiresNoFlag: "hasCarGen1",
            effects: { money: -25, frustration: 20 },
            result: "Your partner would rather just go somewhere else. 'No no we're gonna go to this place on the bus it'll be fine.'Two buses. 90 minutes EACH WAY. Your partner's not speaking to you. The food's probably good but you can't taste it through the stress. On the way home at 11pm you pass a Cadillac billboard showing a happy couple driving to dinner. Your partner stares at it in silence. The silence is LOUD. Bus fare, dinner, and the present you give to your partner as an apology: $25."
        },
        {
            text: "FIND A DOWNTOWN RESTAURANT INSTEAD",
            effects: { money: -12, frustration: 10 },
            result: "You find a gorgeous place downtown you can walk to. Candlelight! Wine! Everything's perfect until your partner mentions 'Janet from work went to that suburban place and said it was INCREDIBLE.' The mood deflates like a sad balloon. You walk past a Cadillac billboard with a couple driving somewhere fun. Your partner goes 'must be nice.' Uh oh. Dinner: $12."
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
            text: "CALL THE EXPENSIVE AMBULANCE",
            effects: { money: -450, frustration: 50 },
            result: "You call 911. The ambulance takes 18 MINUTES to arrive. Your partner's screaming and crying the entire time. You're both crying. Surgery's successful but those 18 minutes aged you 10 years. If you'd had a car you could've been GONE. Your partner says from the hospital bed 'we're getting a car' and you nod because YEAH. NO KIDDING. Ambulance: $450."
            },
        {
            text: "WAKE UP A NEIGHBOR TO DRIVE YOU",
            effects: { money: -20, frustration: 55 },
            result: "You knock on THREE doors at 2am. First neighbor yells at you through the door. Second neighbor pretends they're not home. Third neighbor - Frank, of course it's Frank - opens up in his bathrobe, sees your partner's situation, and RUNs to get his keys. He drives 80mph to the ER. Your partner's okay. Frank saved the day. Being carless means gambling on Frank's mercy at 2am. You're buying a car TOMORROW. Gas money and a gift for Frank: $20."
        }
    ]
},
{
    year: 1956,
    title: "The Last Streetcar",
    narrative: "April 8, 1956. Detroit's final streetcar makes its last run down Woodward Avenue. Crowds gather to watch. People are crying. The bells ring one last time, then stop forever. You rode these everywhere just a few years ago - Paradise Valley, Belle Isle, downtown - all for a dime. The Motor City is killing its streetcars so people have to buy more cars. That's some next-level irony.",
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
            result: "You watch the funeral from your driver's seat with the engine running. Burning gas to watch public transit die. A photographer is taking pictures for the Free Press. A little kid asks 'why is everyone sad?' Their parent tries to explain but gives up. An old lady who's been riding since the 1920s won't stop crying. Frank drives by, honks, and gives you a thumbs up like this is good news. Frank doesn't get it, but this is the Motor City after all. Gas fill-up: $3."
        },
        {
            text: "RIDE THE FINAL STREETCAR",
            effects: {frustration: 15 },
            result: "You squeeze onto the final car with everyone who loved these things. Someone's crying into a handkerchief. A guy with a camera is documenting everything. An old man stands up and yells 'Thank you for sixty years!' and everyone claps. The bells ring one last time. When you step off, you realize the buses that are replacing this are terrible. They don't go to half the places. They're slow. They're unreliable. The Motor City is going fully motor. Fare: 10 cents, forever.",
            forceNext: true
        },
        {
            text: "BUY A CAR RIGHT NOW",
            requiresNoFlag: "hasCarGen1",
            effects: { money: -1050, monthlyExpenses: 45, frustration: 20, carsOwned: 1 },
            result: "The streetcars are dead. Time to join Team Car. You buy a used Pontiac from your coworker that week for $1,050. When you pull into your driveway, Frank is immediately outside. 'Nice wheels!' he yells. You barely got the door open. Frank wants to look under the hood. Frank wants to talk horsepower. Frank wants to tell you about his Chevy from 1952. You're out there for 45 minutes. Frank will not stop talking. But you're in the car club now - Detroit just eliminated public transit and forced everyone into car ownership and more conversations with Frank... Car: $1,050. Monthly costs: $45.",
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
    title: "Partner's New Job",
    narrative: "Your partner's department store just opened a massive new location in Southfield - it's a promotion with better pay and they're super happy. Great news! Except it's 12 miles away and there's literally no bus that goes there. You have ONE car between you. Your partner needs to be there by 8:30am. You need to be downtown by 8:15am. The math isn't mathing. Someone's waking up at the ass-crack of dawn every morning or you're draining your savings for a second car.",
    image: "images/mall.jpg",
    choices: [
        {
            text: "BUY A SECOND CAR",
            effects: { money: -1050, monthlyExpenses: 40, frustration: -10, carsOwned: 1 },
            result: "You buy a second car. A used '59 Ford Fairlane from Frank's cousin who 'barely drove it' (it has 90,000 miles on it, Frank's cousin is a liar). Two cars. Two insurance bills. Two registrations. Two oil changes. Two everything. But you both keep your jobs! Your partner gets the raise! You can both leave the house at normal human hours! YAY! Second car: $1,050. Monthly costs: $40.",
            flags: { partnerHasCar: true }
        },
        {
            text: "SHARE ONE CAR",
            effects: { money: -50, frustration: 40 },
            result: "You wake up at 5:30am in complete darkness to drive your partner to Southfield. Drive 12 miles back downtown to your job. Work all day exhausted. Leave at 4:45pm to pick them up. They get in the car and IMMEDIATELY start critiquing your lane changes. One day you call in sick just to take a relaxing day off from driving them. Your entire life is car logistics and resentment. Extra gas: $50/month.",
            forceNext: true
        },
        {
            text: "PARTNER TURNS DOWN THE PROMOTION (SORRY...)",
            effects: { monthlySalary: -150, frustration: 35 },
            result: "Your partner turns down the promotion to avoid the car nightmare. More money? Gone. Better position? Gone. They keep sighing REALLY LOUD while doing the dishes. Yesterday they said 'lots of households have two cars now' while watching TV. You pretended not to hear. The tension is unbearable. Suburban sprawl just murdered your partner's career advancement and your marriage is dying with it."
        }
    ]
},
{
    year: 1962.5,
    title: "The Great Car Fight of 1963",
    narrative: "Three months of hell. You're late to work constantly because you're exhausted from 5:30am wake-ups. Yesterday you literally fell asleep during a meeting and your boss had to wake you up. Your partner won't stop passenger seat driving. Last Tuesday you SCREAMED 'I SWEAR TO GOD IF YOU TELL ME HOW TO MERGE ONE MORE TIME' and they didn't talk to you for two full days. Your neighbor asked if everything's okay at home. Everything is NOT okay. It's car or divorce at this point.",
    requiresForced: true,
    image: "images/maddriving.gif",
    choices: [
        {
            text: "BUY A SECOND CAR",
            effects: { money: -1150, monthlyExpenses: 40, carsOwned: 1 },
            result: "You buy another car. A '60 Chevy Corvair. Your partner is SO HAPPY they literally cry. You both apologize for the screaming. You sleep in the same bed again. The first morning you both leave at your own times and you kiss them goodbye like it's your wedding day. True love is two car payments. Romance! Second car: $1,150. Monthly: $40.",
            flags: { partnerHasCar: true },
            forcedChoice: true
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
    narrative: "All your friends are fleeing to the suburbs like it's an evacuation. Bloomfield Hills! Grosse Pointe! Royal Oak! Everyone's buying houses with YARDS and talking about 'good schools' even though their kids are still in diapers. Your downtown lease is up. The corner bakery just closed. Your favorite diner is moving to Southfield. Frank moved last month and keeps calling to tell you about his LAWN. Do you follow the exodus or stay in the city?",
    image: "images/suburbs.jpg",
    choices: [
        {
            text: "MOVE TO BLOOMFIELD HILLS",
            effects: { monthlyExpenses: 500, money: -1000, frustration: 20 },
            result: "You move to Bloomfield Hills. The house is twice the size and costs less than your downtown apartment. There's a YARD! You have to drive everywhere now though. Grocery store: 10-minute drive. Bank: 15-minute drive. Pharmacy: 12-minute drive. Friend's house: 8-minute drive. Nothing is walkable. Frank lives three blocks over and now you see him CONSTANTLY. He keeps inviting you to backyard barbecues. You're trapped in suburbia with Frank forever. Moving costs: $1,000.",
            flags: { movedToSuburbs: true }
        },
        {
            text: "STAY DOWNTOWN",
            effects: { money: -200, frustration: 10 },
            result: "You renew your lease. The baker retired. The diner moved. Half the apartments in your building are empty. But you can still walk to the corner store! You can still walk to go eat! Your suburban friends keep asking 'when are you moving out?' You will stay in DETROIT the city, not be one of those people that says 'Im from Detroit, but they really live in Millford. Lease renewal: $200."
        },
        {
            text: "MOVE TO DEARBORN",
            effects: { monthlyExpenses: 300, money: -600, frustration: 15 },
            result: "You move to Dearborn. Not full suburbs, not quite city. You drive to work but you can still walk to some stores. There's a small yard. The houses all look kind of the same. It's good, It's a compromise. Moving costs: $600.",
            flags: { movedToSuburbs: true }
        }
    ]
},
         {
    year: 1966,
    title: "Weekend at the Lake",
    narrative: "Your friends are going to somebody's uncle's lake house upstate for the weekend. Eighty miles north. Swimming! Grilling! Beer! They're carpooling and there's room for you and your partner. Sounds perfect EXCEPT you'd be completely trapped on their schedule - leave Friday at 5pm SHARP, come back Sunday at 3pm SHARP, zero flexibility. Your friend Janet is the driver and she's very particular about her departure times. Very. Particular.",
    image: "images/lakeday.jpg",
    choices: [
        {
            text: "DRIVE YOUR OWN CAR",
            effects: { money: -45, frustration: -15 },
            result: "You drive your own car. Leave when you want! Stay an extra night if you feel like it! Stop at that weird roadside diner with the giant chicken! On Sunday afternoon Janet's carpool has to leave at 10am sharp because Janet has 'plans'. You stay until sunset. Drive home at your own pace. Stop for ice cream. Gas, ice cream, roadside diner pie, and other lake costs: $45."
        },
        {
            text: "CARPOOL WITH JANET",
            effects: { money: -15, frustration: 5 },
            result: "You carpool with Janet. Big mistake. Janet wants to leave at 4:58pm on Friday. You arrive at 5:01pm and she's really annoyed. She only listens to AM radio the entire drive. Your car has FM radio too... Saturday night you want to stay up late but Janet wants everyone in bed by 10pm because 'we're leaving at 10am tomorrow and I want you rested.' Sunday at 10 am she's honking the horn. You save $30 on gas but at what cost. Your sanity, that's the cost. Your contribution to gas and other lake costs: $15."
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
                    link: "https://riseupdetroit.org/chapters/chapter-2/part-1/urban-renewal/"
                },
                choices: [
                    {
                        text: "STAY IN THE CITY",
                        requiresNoFlag: "movedToSuburbs",
                        effects: {frustration: 25 },
                        result: "You stay downtown. The city needs people who won't abandon it. But businesses keep leaving. Your corner grocery store closes. The hardware store moves out to the suburbs. Everything is getting harder."
                    },
                    {
                        text: "WATCH THE NEWS FROM THE SUBURBS",
                        requiresFlag: "movedToSuburbs",
                        effects: {frustration: 10 },
                        result: "You watch the news from your suburban house. You're insulated from the unrest. Your commute gets you away from it all. But you can't help but wonder about the role suburban flight played in all of this. Car maintenance this month: $150."
                    },
                    {
                        text: "MOVE TO THE SUBURBS",
                        requiresNoFlag: "movedToSuburbs",
                        effects: { money: -1000, monthlyExpenses: 200, frustration: 20 },
                        result: "You join the exodus. The suburbs feel safer, newer, more stable. You're part of white flight whether you want to admit it or not. The city hollows out behind you. Moving costs and deposits: $500.",
                        flags: { movedToSuburbs: true }
                    }
                ]
            },
             {
                year: 1970,
                title: "The Downtown Parking Nightmare",
                narrative: "You have a doctor appointment downtown at 2pm. Should be simple! Except parking is now a WHOLE THING. Parking meters everywhere - 25¢ an hour and you need quarters. The parking garage wants $2 (ROBBERY). Or you could circle the blocks for free parking like a shark hunting prey. Your appointment is in 20 minutes. Your blood pressure is rising and you haven't even seen the doctor yet. This is what car ownership means - paying money for your car to just sit there.",
                image: "images/meters.jpg",
                choices: [
                    {
                        text: "PAY FOR THE PARKING GARAGE",
                        effects: { money: -2, frustration: -5 },
                        result: "You pay the $2 garage fee. The attendant takes your money with dead eyes. You walk to your appointment fuming about the principle. You own a car. You paid for the car. You pay for gas. You pay for insurance. And now you're PAYING for it to SIT MOTIONLESS in a concrete box? The hidden costs never end. Every downtown trip costs money now. Your car is a financial vampire that drains you even when it's parked. Parking: $2."
                    },
                    {
                        text: "CIRCLE ENDLESSLY HUNTING FOR FREE PARKING",
                        effects: { money: -1, frustration: 15 },
                        result: "You circle the same four blocks for TWENTY MINUTES. That spot! No wait, fire hydrant. That spot! No, wow that's a really small car. That spot! Nope, street cleaning. You're burning gas to find free parking which defeats the purpose. You finally find a spot six blocks away. You're now 15 minutes late and sweating from the walk. The receptionist is judging you. Your doctor asks if you're okay - your heart rate is elevated. 'It's the parking,'. They don't understand. Gas wasted: $1."
                    },
                    {
                        text: "PARK AT A METER",
                        effects: { money: -24, frustration: 25 },
                        result: "You find a meter! You dump in quarters. 25¢ buys you one hour. Your appointment runs long. You SPRINT out mid-exam - still in the paper gown - to feed more quarters into the meter. The doctor is confused. You run back. Ten minutes later the nurse says 'you're all set!' You walk outside to find a $5 parking ticket on your windshield anyway. The meter expired while you were getting your blood pressure checked (ironic). You just paid $4 to park for a $20 doctor visit. Total disaster: $24."
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
                        effects: { money: -80, monthlyExpenses: 25, frustration: 50 },
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
                        effects: { monthlySalary: 2000, monthlyExpenses: 800 },
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
                        effects: { money: -8000, monthlyExpenses: 300, frustration: -15, carsOwned: 1 },
                        result: "The '79 Buick Regal has airbags and a solid frame. The car seat clicks in perfectly. When the engine purrs to life, you feel like a responsible parent. Monthly costs: payment $140, insurance $90, gas $70. The payments will be steep but your baby deserves safe transportation."
                    },
                    {
                        text: "KEEP THE OLD CAR AND INSTALL A CAR SEAT",
                        effects: { money: -140, monthlyExpenses: 50, frustration: 20 },
                        result: "You strap the car seat into the rust-bucket and pray it holds together. Every weird engine noise makes your stomach drop. Every time someone speeds past you on I-75, you grip the wheel tighter. But you don't want to buy a new car. Sometimes needs outweigh wants."
                    },
                    {
                        text: "BUY A USED CAR",
                        effects: { money: -4500, monthlyExpenses: 100, frustration: 5, carsOwned: 1 },
                        result: "A '76 Ford with 80,000 miles on it. Not perfect, but definitely safer than what you had. It has working brakes and decent tires. Monthly costs: payment $95, insurance $65, gas $45. The baby will probably be fine."
                    }
                ]
            },
            {
                year: 1984,
                title: "Tigers Win the World Series!",
                narrative: "October 1984. The Detroit Tigers just won the World Series! The city is going ABSOLUTELY INSANE. People are flooding downtown to celebrate. Woodward Avenue is packed. Cars honking. People hanging out of windows. This is Detroit's moment! Your friends are all heading downtown to party. Are you?",
                image: "images/tigers.jpg",
                fact: {
                    text: "The Tigers won the 1984 World Series, sparking massive celebrations in Detroit. Despite the city's economic struggles, 80,000+ fans flooded downtown to celebrate - one of Detroit's biggest parties ever.",
                    link: "https://www.vintagedetroit.com/night-detroit-tigers-won-1984-world-series/?srsltid=AfmBOooi3g3lBuch8vJKzpUrjph7EVJdJ37hSbf2yZ5Ap_leeQLUSBoi"
                },
                choices: [
                {
                    text: "DRIVE AROUND TO SEE THE CELEBRATION",
                    requiresNoFlag: "movedToSuburbs",
                    effects: { money: -20, frustration: -25 },
                    result: "You drive around just to see what's happening. Woodward Avenue is absolute MADNESS. People everywhere. Dancing in the streets. Honking. Screaming. You roll down your windows and someone hands you a beer through the car window. Hey you're driving... You're honking with everyone else. This is DETROIT at its best! You loop around for two hours just soaking it in. Park eventually and join the street party. You're home by 2am grinning. This is why you stayed in the city. Gas and a new tigers hat: $20."
                },
                {
                    text: "DRIVE INTO THE CITY",
                    requiresFlag: "movedToSuburbs",
                    effects: { money: -40, frustration: -25 },
                    result: "You drive downtown into pure CHAOS. Woodward Avenue is packed. Takes you forever to find parking. People are dancing ON TOP of cars. Someone's blasting 'We Are the Champions' from their trunk. You join thousands of screaming fans in the streets. Strangers hugging! Beer everywhere! Hey you only get ONE because you're driving. This is DETROIT! You get home at 3am hoarse and happy. Gas, parking ticket you definitely got, beers: $50."
                },
                {
                    text: "WALK DOWNTOWN",
                    requiresNoFlag: "movedToSuburbs",
                    effects: { money: -40, frustration: -25 },
                    result: "You WALK downtown because you can! This is why you stayed in the city! Within minutes you're in the middle of the biggest party Detroit's seen in years. People EVERYWHERE! You're hugging strangers! Someone hands you a beer! The Tigers won and you're HERE for it! Your suburban friends are stuck in traffic or watching on TV. You're LIVING it. Celebration beers: $40."
                },
                {
                    text: "WATCH ON TV AT HOME",
                    effects: { frustration: 30 },
                    result: "You watch from your couch. The TV shows Woodward Avenue absolutely PACKED with celebrating fans. The energy looks incredible. You're sitting alone eating chips. Your friends text you photos from downtown - it looks AMAZING. You stayed home because parking seemed like a hassle. Now you're missing Detroit's biggest celebration in years. Monday everyone has stories."
                },
                {
                    text: "THROW A HOUSE PARTY",
                    effects: { money: -80, frustration: -10 },
                    result: "You throw a watch party at your place. Friends come over. You're watching the chaos on TV together while drinking beers in your living room. You even invited Frank and he brings potato salad that's wow really good. It's fun! It's nice! You're one degree removed from the real party but still, you saved on gas and parking. Snacks and beer: $80."
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
                        text: "THIS DOESN'T AFFECT YOU",
                        effects: {frustration: -25 },
                        result: "You barely notice the news. Transit was already basically dead here anyway. With your two reliable cars, you're completely insulated from this policy change. Oil changes for both cars this month: $150."
                    },
                    {
                        text: "ATTEND CITY MEETING AND SPEAK AGAINST THE CUTS",
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
            year: 1987,
            title: "The People Mover Opens!",
            narrative: `July 31, 1987. The Detroit People Mover officially opens! Mayor Coleman Young cuts a giant cake shaped like a train car. They release 10,000 balloons. This is DETROIT'S BIG TRANSIT COMEBACK! Automated trains! Modern technology! Except... it's a 2.9-mile loop that only goes around downtown. It doesn't go to the suburbs or anywhere outside that loop. It doesn't go to the airport. It doesn't connect to anything. President Ford offered Detroit $600 million for regional rail. Detroit built this tiny loop instead. But hey - it's cheap!`,
            image: "images/peoplemover.png",
            fact: {
                text: "The People Mover opened in 1987 as Detroit's 'return to rail' - 31 years after streetcars died. But it only operates in a 2.9-mile downtown loop. By 2008 it carried 7,500 riders daily - just 2.5% of its capacity. President Ford offered $600M for regional rail; Detroit built this instead.",
                link: "https://www.midstory.org/circuit-breakers-the-detroit-people-mover-and-the-promise-of-non-essential-transit/"
            },
            choices: [
                {
                    text: "RIDE IT OPENING DAY",
                    requiresNoFlag: "movedToSuburbs",
                    effects: { money: -5.50, frustration: -10 },
                    result: "You ride opening day with thousands of excited Detroiters! The trains are SHINY and automated! Mayor Young is there! There are BALLOONS! It's 50 cents to ride! Rail is BACK in Detroit after 31 years! You're crying a little. Then you realize... it only goes in a tiny loop downtown. It doesn't go to your house in the suburbs. It doesn't go to the airport. It doesn't go ANYWHERE you actually need. It's a 2.9-mile tourist attraction pretending to be transit. But it EXISTS! Maybe this is the start of something bigger? Fare and celebration hot dog: $5.50."
                },
                {
                    text: "IT'S USELESS IN THE SUBURBS",
                    requiresFlag: "movedToSuburbs",
                    effects: { frustration: 15 },
                    result: "The People Mover is cute but completely useless to you. You live in Bloomfield Hills. It goes in a loop downtown. Cool for the 47 people who live AND work downtown. You're still driving everywhere. Detroit had a chance to build REAL regional transit and built a carnival ride instead. President Ford offered $600 MILLION for a regional system. This is what Detroit chose. A toy train that goes nowhere."
                },
                {
                    text: "RECOGNIZE THE FAILURE",
                    effects: { frustration: 25 },
                    result: "You read about it in the Free Press. They're celebrating like Detroit solved transportation. But this is a JOKE. It's 2.9 miles. In a loop. It doesn't connect to neighborhoods. It doesn't go to suburbs. It doesn't connect to the airport. President Ford offered $600 million for regional rail and Detroit built a downtown loop instead. Thirty-one years after killing the streetcars, THIS is the comeback? The city that builds cars can't build real transit."
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
                        text: "EMBRACE THE CONVENIENCE",
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
                        effects: { money: -4500, monthlyExpenses: 250, frustration: -15, carsOwned: 1 },
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
                        effects: { money: -2250, monthlyExpenses: 125, frustration: -5, carsOwned: 1 },
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
                        text: "BUY A DIFFERENT USED CAR",
                        effects: { money: -5200, monthlyExpenses: 200, frustration: -10, carsOwned: 1 },
                        result: "You sell the old car for $800 and buy a '96 Toyota for $6,400. Title and fees add another $800. Monthly costs: insurance $105, gas $85, payment if financed $140. It's a fresh-ish start but it's still a used car. How long will this one actually last?"
                    },
                    {
                        text: "FINANCE A NEWER CAR",
                        effects: { money: -4800, monthlyExpenses: 350, frustration: -10, carsOwned: 1 },
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
                        effects: { monthlySalary: 3500, monthlyExpenses: 1100 },
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
                        text: "MOVE DOWNTOWN AND BUY A CAR",
                        effects: { money: -2800, monthlyExpenses: 700, frustration: 10 },
                        result: "Renovated loft, exposed brick, huge windows. Half your entire paycheck is gone to rent. You can walk to restaurants and bars. You still need a car to get to work though. First and last month's rent ate $2,800 of your savings.",
                        flags: { livingDowntown: true, hasCar: true }
                    },
                    {
                        text: "MOVE TO SUBURBS WITH A CAR",
                        effects: { money: -20000, monthlyExpenses: 630, frustration: 15, carsOwned: 1 },
                        result: "You lease a 2004 Civic and rent an apartment in Royal Oak. Down payment and first month wiped out $3,500 of your savings. Monthly breakdown: rent $850, car payment $350, car insurance $425, gas $115, utilities $190, food and everything else $700. It's a 35-minute commute each way. You have space and some breathing room in your budget. Sort of.",
                        flags: { hasCar: true }
                    },
                    {
                        text: "LIVE WITH YOUR PARENTS",
                        effects: { money: -200, monthlyExpenses: 100, frustration: 35 },
                        result: "You're 22 years old and living in your childhood bedroom again. Your parents are absolutely thrilled. You are decidedly not. You save thousands of dollars per month but you can't bring a date home. You can't host your friends. You can't feel like an actual adult. You keep promising yourself this is just temporary. You're giving your parents $100/month to help with groceries and utilities.",
                        flags: { livingWithParents: true }
                    }
                ]
            },
            {
                year: 2005,
                title: "Your Parents Need Their Cars",
                narrative: "You need to get to work every day. Your parents both use their cars for their own jobs. The bus from their suburb takes 90 minutes each way with two different transfers. You can't keep borrowing their car forever. You need your own transportation, or you need to move out somewhere closer to work. Fast.",
                image: "images/geturcar.gif",
                requiresFlag: "livingWithParents",
                choices: [
                    {
                        text: "BUY A USED CAR",
                        effects: { money: -12000, monthlyExpenses: 300, frustration: 30, carsOwned: 1 },
                        result: "You buy a used car with 60,000 miles on it. Down payment eats $3,000 of your savings. Monthly breakdown: car payment $300, insurance $425 (because Detroit rates are brutal), gas $135, food and everything else $700. At least you can reliably get to work now. Living with your parents in the suburbs basically requires having a car.",
                        flags: { hasCar: true }
                    },
                    {
                        text: "MOVE DOWNTOW AND BUY A CAR",
                        effects: { money: -3800, monthlyExpenses: 700, frustration: -15 },
                        result: "You find a studio apartment downtown and sign the lease that same day. First month, last month, and security deposit completely wipe out $2,800 of your savings. But now you can walk to breakfast every morning. You still need a car for work though.",
                        flags: { livingWithParents: false, livingDowntown: true, hasCar: true }
                    }
                ]
            },
            {
                year: 2005,
                title: "Detroit Insurance",
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
            text: "MOVE DOWNTOWN AND BUY CAR",
            effects: { money: -2800, monthlyExpenses: 1100, frustration: -30, carsOwned: 1 },
            result: "You find a studio downtown. First, last, security deposit: $2,800 gone. You're broke but finally FREE. No more Pokemon posters. Moving and car: $2,800.",
            flags: { livingWithParents: false, livingDowntown: true, hasCarGen3: false, soldCarGen3: true }
        }
    ]
},
{
    year: 2007,
    title: "Pistons Playoff Game",
    narrative: `The Pistons are in the playoffs! Your friend scored tickets to a game at The Palace of Auburn Hills. Chauncey Billups! Rasheed Wallace! The Palace is 35 miles north in the suburbs. You have a car so getting there is easy. But after the game, everyone wants to hit different bars in different suburbs and you're all driving separately. Metro Detroit's sprawl means even hanging out with friends requires complex driving logistics.`,
    image: "images/billups.gif",
    fact: {
        text: "The Palace of Auburn Hills (1988-2017) was located 35 miles from downtown Detroit with zero public transit access. The Pistons didn't return to playing IN Detroit until 2017.",
        link: "https://www.stadiumjourney.com/stadiums/the-palace-of-auburn-hills-detroit-pistons"
    },
    choices: [
        {
            text: "DRIVE TO THE PALACE",
            effects: { money: -95, frustration: -15 },
            result: "You drive 35 miles to Auburn Hills blasting 'Umbrella' by Rihanna. The game is INCREDIBLE! Pistons win! After, everyone scatters to different suburbs in different directions. Your friend wants a bar in Royal Oak. Another friend suggests Ferndale. Someone else says Rochester. You all drove separately so you can't even ride together. You end up at a bar alone near The Palace because driving another 20 miles sounds exhausting. Gas, parking, ticket, beer: $95."
        },
        {
            text: "COORDINATE A CARPOOL",
            effects: { money: -80, frustration: 10 },
            result: "You organize everyone to carpool in your car. It takes 23 text messages to coordinate. The game is amazing! But after, you're STUCK with everyone's schedules. One person wants to leave immediately. Another wants to stay for drinks. You're not watching the game, you're managing logistics. You drive everyone home to three different suburbs. You're basically an unpaid Uber. Your car enabled the hangout but also made you responsible for it. Gas and ticket: $80."
        },
        {
        text: "SKIP THE GAME",
        effects: { money: -10, frustration: 30 },
        result: "Thirty-five miles to Auburn Hills on a work night? You're exhausted just thinking about it. You bail. Your friends go without you. Monday they won't stop talking about the game, the energy, the afterparty at some bar in Rochester Hills. You stayed home watching 'The Office' reruns. The Pistons don't even play IN Detroit anymore and it's making you antisocial. White Castle burgers for yourself: $10"
        }
    ]
},
    {
    year: 2008,
    title: "Auto Industry Collapses",
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
            text: "KEEP EVERYTHING THE SAME",
            effects: { money: -400, frustration: 20 },
            result: "You keep the car, keep the apartment, keep everything exactly the same and just... hope. Your stress builds. Your car needs repairs you can barely afford. You're playing financial chicken with a recession. Emergency expenses: $400."
        }
    ]
},
        {
        year: 2012,
        title: "Your Car Dies on I-94",
        narrative: `Your car completely DIES on I-94 during your morning commute. Just dead. Won't start. Traffic is backing up behind you. People are SCREAMING. You're mortified. The tow truck costs $125. The mechanic's diagnosis: 'Yeah, transmission is completely shot. $3,200 to rebuild it.' Your car is 8 years old with 100,000 miles. You could fix it, junk it and buy used, or lease something new. What do you do?`,
        image: "images/carbreakdown.gif",
        choices: [
            {
                text: "REBUILD THE TRANSMISSION",
                effects: { money: -3325, frustration: 40 },
                result: "Tow plus transmission rebuild: $3,325 total. The car runs again but it's ANCIENT. You're basically in an abusive relationship with this vehicle at this point. How long before the next catastrophic failure? You're listening to Gotye's 'Somebody That I Used to Know' on the radio and relating way too hard to your car. You're throwing good money after bad but you can't let go. Total: $3,325."
            },
            {
                text: "BUY A DIFFERENT USED CAR",
                effects: { money: -11000, monthlyExpenses: 50, frustration: -5, carsOwned: 1 },
                result: "You junk it for $800 and buy a 2009 Honda Civic with 75,000 miles for $12,000. Way more reliable! The salesman is playing Carly Rae Jepsen's 'Call Me Maybe' and you're feeling optimistic. Lower insurance! Better gas mileage! The debt cycle continues forever but at least this one probably won't die on I-94. Probably. Net cost after trade-in: $11,000."
            },
            {
                text: "LEASE A NEWER CAR",
                effects: { money: -2500, monthlyExpenses: 480, frustration: 5 },
                result: "You lease a brand new 2012 Toyota Camry. No more breakdowns! No more repairs! Just $480/month. You're trapped in the lease cycle but the car is shiny and WORKS and has an mp3 cable so you can blast your Ipod playlists. You're listening to fun.'s 'We Are Young' and feeling like you made a responsible adult decision. Down payment: $2,500, monthly: $480."
            },
            {
                text: "BUY A CHEAP BEATER",
                effects: { money: -3700, monthlyExpenses: -120, frustration: 20 },
                result: "Junk yours for $800, buy a $4,500 beater off Craigslist. It's a 2004 with 140,000 miles. It smells like cigarettes and regret. The previous owner left a Nickelback CD stuck in the player. But it RUNS and insurance is way cheaper. You're cutting costs while keeping wheels. It's not pretty but it's practical. Net cost: $3,700."
            }
        ]
    },
            {
                year: 2016,
                title: "Car Maintenance Never Actually Ends",
                narrative: "Car maintenance is absolutely constant and never-ending. New tires: $600. Complete brake job: $400. New battery: $180. Oil changes throughout the year: $180 total. Annual registration fee: $120. Even when a car is completely paid off, it still costs you money forever and ever.",
                requiresFlag: "hasCar",
                image: "images/maintenance.gif",
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
                image: "images/detoitcovid.jpg",
                choices: [
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
            effects: { money: -50, frustration: -10 },
            result: "You just walk to the store in your mask. Streets are EMPTY. No traffic. Peaceful. You walk up and down the street in your mask. You've recently gotten back into Glee. You walk all day listening to the Glee cast. Hey some glee versions are better than the originals... You realize how nice walking is when there aren't so many cars around. You would walk the whole city if you could. You do have six seasons of Glee music to listen to. Groceries: $50."
        },
        {
            text: "BUY A BIKE",
            effects: { money: -200, frustration: -5 },
            result: "You buy a bike to avoid buses and people during COVID lockdown. Biking through ghost-town Detroit is surreal. You see like 3 other people outside. The Motor City is completely empty and you're biking through it. Biking with no cars is so nice and peaceful. Bike: $200."
        },
        {
            text: "PANIC-BUY A CAR TO ESCAPE TO FAMILY",
            requiresNoFlag: "hasCar",
            effects: { money: -15000, monthlyExpenses: 380, frustration: 30, carsOwned: 1 },
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
            title: "Weekend Trip to Traverse City",
            narrative: `Your friends are planning a weekend trip to Traverse City - 4 hours north through pure Michigan beauty. Cherry orchards! Wineries! Sleeping Bear Dunes! Everyone's driving up Friday after work, staying at an Airbnb, coming back Sunday. Except everyone's leaving at slightly different times from different suburbs and the group coordination is hard. Do you drive solo and have flexibility, or carpool and save gas but be trapped on someone else's schedule?`,
            image: "images/traversecity.jpg",
            choices: [
                {
                    text: "DRIVE YOUR OWN CAR",
                    effects: { money: -180, frustration: -15 },
                    result: "You drive solo. Leave Friday at 7pm when you want. Stop at roadside cherry stands. Take the scenic route. Stay until Monday morning because you can. Your friends in the carpool had to leave Sunday at 3pm sharp. You're swimming in Lake Michigan Monday morning while they're already back at work. Solo road trip blasting your own Spotify playlist, nobody judging you for playing Industry Baby by Lil Nas X 10 times on the way there. Activities and food: $180."
                },
                {
                    text: "ORGANIZE A CARPOOL",
                    effects: { money: -125, frustration: 25 },
                    result: "You organize a carpool to save gas. This requires 47 text messages and a shared Google Doc. You're leaving at 6:15pm SHARP from the Meijer parking lot in Royal Oak. One person is 10 minutes late. Everyone's annoyed. Your friend driving only listens to country music the ENTIRE drive. Four hours of Luke Bryan. You ask if they could play a little Kacey Musgraves because she's country too. They say no. Chris Stapleton? Ok. Your gas share and other food and activities: $125."
                },
                {
                    text: "SKIP IT",
                    effects: { frustration: 35 },
                    result: "Four hours of driving each way after a long work week? You're EXHAUSTED just thinking about it. You skip it. Your friends go without you. Monday they're all sharing photos from the dunes, posting about their weekend. You stayed home watching 'Euphoria' and ordering DoorDash. You're missing out on life because driving 8 hours round trip sounds like hell. You wish there was a train or something..."
                },
                {
                    text: "RENT AN RV - GO BIG",
                    effects: { money: -550, frustration: -20 },
                    result: "You rent an RV and offer to drive everyone. Everyone piles in. It's a PARTY on wheels. Someone brings a speaker. You're blasting music, laughing, it's a vibe. You camp in the RV near the beach. This is peak Michigan summer. Your friends Venmo you gas money. You spent more money but created the best memories. RV rental, gas, and being the cool friend: $550."
                }
            ]
},
           {
    year: 2023,
    title: "Your BFF's Chicago Wedding",
    narrative: "Your college best friend is getting married in Chicago and you desperately want to be there for them. You start looking at your transportation options from Detroit and reality sets in FAST. Flying costs $420 total. Driving would be $180 in gas plus 4 hours of your life behind the wheel. Taking Amtrak would be 5 hours and $140 but the train only runs once a day at weird times. Every option has a catch.",
    image: "images/chicago.gif",
    choices: [
        {
            text: "FLY THERE",
            effects: { money: -420, frustration: 15 },
            result: "You fly out of Detroit Metro. The flight is only about 50 minutes but you have to get there 90 minutes early for security. Your Uber to the airport is $45. The flight gets delayed 45 minutes - you're stress watching Succession feeling like Kendall Roy. You land, Uber to the hotel, finally arrive. The wedding is beautiful! You and your BFF karaoke 'Karma' by Taylor Swift at the afterparty. Sunday you do it all in reverse. You spent $420 and 2 total hours of air time to go 280 miles. In Japan this would be a $60 train ride. Flight, Ubers, and wedding gift: $420."
        },
        {
            text: "DRIVE THERE",
            requiresFlag: "hasCar",
            effects: { money: -280, frustration: 30 },
            result: "You drive 4.5 hours listening to your 'Road Trip 2023' Spotify playlist. You're singing along to 'Unholy' by Sam Smith and Kim Petras - an inside reference between you and your bestie. The wedding is gorgeous! You and your BFF karaoke 'Karma' by Taylor Swift at the afterparty. Sunday you drive 4 hours back listening to your favorite Bright Eyes album. You spent 8ish hours of your weekend behind a steering wheel for a wedding. Your back hurts. Your ass is numb. American infrastructure failure turned a 280-mile trip into a full day of driving. Gas, tolls, hotel, and gift: $280."
        },
        {
            text: "TAKE AMTRAK",
            effects: { money: -240, frustration: 25 },
            result: "You take the Amtrak Wolverine. The train leaves Detroit at 8am. You're working on your laptop, watching Michigan scenery. Five hours later you roll into Chicago Union Station. It's actually... nice? Relaxing? You read a book! The wedding is great! You and your BFF karaoke 'Karma' by Taylor Swift at the afterparty. Sunday the return train is at 6pm so you have all day in Chicago. You go see the bean! It's so shiny. This almost worked perfectly except the schedule is SO LIMITED - one train per day. If you miss it, you're screwed. Train, hotel, and gift: $240."
        },
        {
            text: "SKIP THE WEDDING",
            effects: { money: -100, frustration: 65 },
            result: "You just can't make any of the options work. Flying is too expensive. Driving is too exhausting. The train schedule doesn't fit your work schedule. You send a generous gift and the world's most apologetic text. Your friend is hurt. You watch their wedding on someone's Instagram story while sitting on your couch eating Chipotle alone. What kind of friend skips their best friend's wedding? You're not a good friend...Gift that doesn't fix anything: $100."
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
                        text: "DRIVE TO THE DATE",
                        requiresFlag: "hasCar",
                        effects: { money: -75, frustration: -10 },
                        result: "You drive to meet your date and jam to 'Titi Me Pregunto' by Bad Bunny to hype yourself up. Fire song but interesting choice. The date is genuinely great. They're funny and interesting and very attractive. But you spent 2 full hours driving for what ended up being a 90-minute date. When they text you the next day suggesting date number two in Ann Arbor (which is 45 minutes away), you hesitate. Geographic distance is starting to feel like a legitimate relationship barrier before this has even really started."
                    },
                    {
                        text: "TAKE AN UBER THERE",
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
                narrative: `Congrats on making it through Detroit, ${gameState.character.firstName}. Time to sit down and add up what car ownership actually cost you. What did 75 years of Detroit car dependency mean?`,
                image: "images/detroit.gif",
                choices: [
                    {
                        text: "SEE HOW YOUR DETROIT STORY ENDED",
                        effects: {},
                        result: "75 years of Detroit. Your grandparents rode streetcars everywhere for a dime, worked union jobs, bought a house for $8,000, watched the Lions actually WIN games in the 1950s (hey yes they're better now but still), and lived in a thriving city of 1.8 million people. Your parents watched people flee to the suburbs, sat in traffic on I-94, watched the city hollow out, and paid for cars their entire lives while the auto industry controlled everything. You: spent thousands on mandatory car ownership, paid America's highest insurance rates ($5,100/year!) just for living in Detroit, survived the 2008 auto industry collapse that nearly murdered the whole city, still can't afford a house even though the city lost a million people (most young people in 2025 can't), and have poured thousands into cars over your lifetime. The streetcars ran 1,000+ miles and they're never coming back. The People Mover is a 2.9-mile loop ride. The Pistons played in Auburn Hills for 29 years instead of Detroit. Frank is still revving his engine at you every morning (he's 100 now!). But HEY - the Lions FINALLY won a playoff game in 2024 after 32 years! Gibbs and Montgomery aka Sonic and Knuckles."
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
        image: "images/factorywarren.jpg",
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
                text: "WORK OVERTIME AND BUILD YOUR SAVINGS FAST",
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
                text: "BUY A CAR AND JOIN THE AMERICAN DREAM",
                effects: { money: -1850, monthlyExpenses: 120, frustration: -10, carsOwned: 1 },
                result: "You buy a car for weekend adventures. Drives up the Hudson. Trips to the beach. It feels like freedom. Until you try to park it in Manhattan. Until the monthly garage bill arrives. Until insurance is due. The car is for leisure, not necessity. That's an expensive hobby. Monthly costs: $120.",
                flags: { hasCarGen1: true }
            },
            {
                text: "STICK WITH THE SUBWAY",
                effects: { money: 75, frustration: -5 },
                result: "Why complicate life? You're saving money while Frank stresses about parking tickets. His car doesn't seem worth all that stress. Franks has always been a show off anyways."
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
                effects: { monthlySalary: 1800, monthlyExpenses: 1000 },
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
                effects: { money: -11000, monthlyExpenses: 250, frustration: -15, carsOwned: 1 },
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
                effects: { money: -70, monthlyExpenses: 100, frustration: 15, carsOwned: 1 },
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
            effects: { money: -190, monthlyExpenses: 90, frustration: -15 },
            result: "They take Metro-North daily. $90/month pass. It works but it's expensive and adds commute time. They're cranky when they get home. Monthly pass: $380."
        },
        {
            text: "BUY SECOND CAR - BOTH NEED INDEPENDENCE",
            requiresFlag: "hasCarGen2",
            effects: { money: -12000, monthlyExpenses: 380, frustration: -15, carsOwned: 1 },
            result: "Two-car household now. Partner drives to Connecticut. You keep your car. Two insurance bills, double gas. Dual-income suburban job life demands this. Monthly second car: $380."
        },
        {
            text: "MOVE TO CONNECTICUT",
            effects: { money: -15000, monthlyExpenses: 400, frustration: 20, carsOwned: 1 },
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
            effects: {frustration: -25 },
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
    image: "images/cardies.gif",
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
                effects: { monthlySalary: 3000, monthlyExpenses: 1200 },
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
                        effects: { money: -2800, monthlyExpenses: 1000, frustration: -15 },
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
            effects: { money: 2500, monthlyExpenses: -80, frustration: 10 },
            result: "Sell for $7,000, buy beater for $4,500. Way lower insurance. You look broke because you ARE. But you're surviving with wheels. Net: +$2,500."
        },
        {
            text: "MOVE TO A WAY CHEAPER APARTMENT",
            requiresNoFlag: "movedToSuburbs",
            effects: { money: -2200, monthlyExpenses: -350, frustration: 25 },
            result: "You flee your nice place for another place deep in Queens. Practically on the border. Rent drops from $1,800 to $1,100. Further from everything, rougher, but you're saving $700/month. Survival mode. Moving: $2,200."
        },
        {
            text: "GET A WEEKEND SIDE HUSTLE",
            effects: { money: 400, monthlyExpenses: -200, frustration: 25 },
            result: "You bartend weekends for extra $400/month. You're working 60 hours a week now. Social life: dead. Energy: gone. Bank account: stabilized. Monthly income: +$400."
        },
        {
            text: "ASK PARENTS FOR A LOAN",
            effects: { money: 3000, frustration: 20 },
            result: "You call your parents and ask for help. They loan you $3,000. You're grateful and humiliated simultaneously. They're worried about you. You promise to pay them back. The recession is breaking your generation. Loan: $3,000."
        },
        {
            text: "FREELANCE ON THE SIDE",
            effects: { money: 300, monthlyExpenses: -200, frustration: 20 },
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
    title: "Giants Game at MetLife Stadium",
    narrative: "Your friend scored Giants tickets for this Sunday! MetLife Stadium in New Jersey. You're HYPED. Then you look up how to get there and... oh no. You can take NJ Transit from Penn Station to Secaucus Junction then transfer to a special stadium shuttle train. Sounds easy! Except the shuttle only runs during games, the return trains get MOBBED, and if you miss the last train you're stranded in New Jersey at midnight. Or you could drive and deal with stadium parking ($40) and traffic. Or Uber ($120 round trip). Why is seeing the Giants this complicated? They're not even good...",
    image: "images/giants.gif",
    fact: {
        text: "MetLife Stadium only got rail service in 2009 and it only runs during major events. You must transfer at Secaucus Junction. After games, trains get so overcrowded that fans sometimes wait 2+ hours to leave.",
        link: "https://www.njtransit.com/meadowlands"
    },
    choices: [
        {
            text: "DRIVE TO METLIFE AND PAY FOR PARKING",
            requiresFlag: "hasCarGen3",
            effects: { money: -140, frustration: 25 },
            result: "You drive to Jersey. Stadium parking is $40 (HIGHWAY ROBBERY). After the game, you sit in the parking lot for 45 MINUTES not moving while 80,000 people try to leave simultaneously. You're listening to the post-game show getting analysis on a game you just watched. You finally escape the lot and hit traffic on Route 3. A 30-minute drive home takes 90 minutes. You spent $140 and half your Sunday sitting in parking lots. This is the NFL experience. Tickets, parking, gas, and a $12 Bud Light: $140."
        },
        {
            text: "TAKE NJ TRANSIT",
            effects: { money: -110, frustration: 35 },
            result: "You take the train from Penn Station to Secaucus Junction (easy!), transfer to the Meadowlands shuttle (fine!), arrive at the stadium (great!). The game is so much fun even though the Giants lost (shocker) Then... the nightmare. You wait in a LINE of 10,000 people trying to get on the shuttle back. You're standing for 90 MINUTES. You finally get on a train so packed you can't breathe. Someone's elbow is in your ribs. At Secaucus you almost miss your connection to NYC. You get home at midnight. The game ended at 7pm. Train tickets and stadium food: $110."
        },
        {
            text: "UBER BOTH WAYS",
            effects: { money: -220, frustration: 15 },
            result: "You Uber to MetLife ($60) and back ($60). Your driver there is playing Miley Cyrus's 'Flowers' and your driver back is playing Jack Harlow and lowkey you're vibin. The game is great! Leaving is EASY - you just walk to the Uber pickup and you're done while everyone else is fighting for trains. But you just spent $120 on rides to see a football game. You could've bought a whole Daniel Jones or Saquon Barkley jersey ( ${gameState.character.firstName} I'm from the future and trust be glad you didn't get either). Uber, tickets, and stadium nachos: $220."
        },
        {
            text: "SKIP THE GAME AND WATCH ON TV",
            effects: { frustration: 35 },
            result: "You bail. The transportation logistics are too ANNOYING. You watch from your couch while your friend texts you updates from the stadium. 'Crowd is insane!' 'Saquon just scored!'(😞) You're eating Doritos alone. American infrastructure made going to a football game 15 miles away such a hassle that you just gave up. Your friend offers you their extra ticket for the next game and you say maybe. You both know it's a no."
        }
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
        title: "Can You Even Afford New York?",
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
        title: "Looking Back at 75 Years in NYC",
        narrative: "Three generations in the greatest city in the world (Hamilton reference), ${gameState.character.firstName}. Time to see what it all meant.",
        image: "images/newyork.gif",
        choices: [
            {
                text: "FINISH YOUR NEW YORK JOURNEY",
                effects: { money: 0, frustration: 0 },
                result: "75 years of New York City. Your grandparents: paid $60/month rent ($784 today), rode the subway for a dime ($1.31 today), walked to Yankee Stadium to see DiMaggio and Mantle (that's ok Mets are cooler now), saw Broadway shows for $5, lived in a city where cars were optional and life was affordable on factory wages. Your parents: survived the 1975 fiscal crisis ('FORD TO CITY: DROP DEAD'), rode burning subway trains in the 1980s when 2,500 fires per year was normal, got mugged (everyone got mugged once, it's a rite of passage), watched the city nearly die and then come roaring back, paid $400/month rent that felt expensive at the time. You: pay $2,800/month rent (61% of your income), ride a $2.90 subway ($3.00 starting in 2026!), survived COVID watching the city empty out, dealt with congestion pricing, watched the Mets break your heart repeatedly, paid $18 for a cocktail in the East Village, got priced out or almost got priced out or definitely got priced out depending on your choices. Transit still EXISTS in New York - you still don't technically NEED a car. That's a miracle. But the city got so EXPENSIVE. Your grandparents thrived here on $300/month factory wages. You barely survive here making $70,000 with a degree. At least the Knicks are pretty good (Thank you Jalen Brunson). The pizza is still elite. The bagels cannot be replicated anywhere else on Earth. You can still take the train at 3am (even if it smells like pee). You can still walk faster than traffic. The city that never sleeps is still here. It's just... different now."
            }
        ]
}
];
const laGen1Scenarios = [
    {
        year: 1950,
        title: "Welcome to Los Angeles",
        narrative: `Welcome to Los Angeles! It's 1950 and the Pacific Electric Red Cars still connect beaches, mountains, downtown, and suburbs across Southern California. It's sunny and warm. The San Gabriel Mountains are visible from downtown. The ocean is just a Red Car ride away. This is paradise on rails.`,
        image: "images/redcars.jpg",
        fact: {
            text: "Pacific Electric operated over 1,000 miles of interurban track in 1950 - one of the world's largest electric railway systems.",
            link: "https://www.thereallosangelestours.com/the-red-cars-las-lost-trams/"
        },
        choices: [
            {
                text: "RIDE THE RED CARS EVERY WEEKEND AND EXPLORE",
                effects: { money: -30, frustration: -10 },
                result: "Santa Monica Pier on Saturday morning. On Sunday you hike to see the iconic HOLLYWOOD sign. Long Beach during the week. The whole region feels like one connected paradise. Holy shit you just saw Marlon Brando while crossing the street! This system is absolutely incredible."
            },
            {
                text: "WORK OVERTIME TO SAVE FOR A HOUSE",
                effects: { money: 200, frustration: 25, jobMultiplier: true },
                result: "Time and a half pays well. Your savings grow fast but you're missing the sunshine. Your coworkers talk about their beach weekends while you're pulling doubles. You hear sunset boulevard is one of the best movies of the year - too bad you don't have any time to go see it. The California dream is happening outside while you're inside working. Worth it?"
            },
            {
                text: "BALANCE WORK AND LEISURE PERFECTLY",
                effects: { money: -10, frustration: 0 },
                result: "40 hours at work. Red Car to Santa Monica beach on Fridays. On Sundays you watch the Rams play at the Memorial Coliseum. You're living the California dream on a regular paycheck. The palm trees sway. Life feels really good here. New pair of sunglasses : $10"
            }
        ]
    },
{
        year: 1952,
        title: "Drive-In Movie Date Night",
        narrative: "There are drive-in movie theaters popping up all over LA - the newest craze. Tonight's showing 'Singin' in the Rain' with Gene Kelly at the Sepulveda Drive-In. Your date is excited. Everyone goes to drive-ins now - it's THE thing to do. Park, hook up the speaker, watch movies under the stars. But you need a car. The Red Car doesn't exactly drop you off at a parking lot full of cars. What should you do?",
        image: "images/driveinsepulveda.jpg",
        choices: [
            {
                text: "SUGGEST A REGULAR THEATER INSTEAD",
                effects: { money: -5, frustration: 20 },
                result: "You suggest Grauman's Chinese Theatre on Hollywood Boulevard instead - totally accessible by Red Car! Your date pauses. 'Oh. Sure. That works.' That pause haunts you. At the theater, the couple next to you won't stop talking about the drive-in they went to last week and how that was better. Your date says 'that sounds fun' a little too wistfully. Then they casually mentions their ex had a Mercury. Oh no why did they bring up their ex. Singing in the Rain is great, but you're dying inside. Tickets and fare: $5."
            },
            {
                text: "BUY A CAR FOR DATE NIGHT",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1300, monthlyExpenses: 45, frustration: -15, carsOwned: 1 },
                result: "This date is NOT dying because of the automotive industry. You buy a used '49 Chevy that week - two-tone paint, chrome bumpers, nice new car radio. Friday you pick up your date looking smooth as hell. Cruise to the Sepulveda Drive-In with the windows down. Park among the sea of cars. Your date's genuinely impressed with you and your car. The speaker's crackling, Gene Kelly's on screen, and you're thinking 'worth every penny.' But damn that's a really expensive date! Car and date: $1,300. Monthly costs: $45.",
                flags: { hasCarGen1: true }
            },
            {
                text: "SKIP THE DATE",
                effects: { frustration: 45 },
                result: "You make an excuse. Something about being sick. Your date says 'no worries!' and goes with their friend who has a convertible.  Monday you hear they had an amazing time and this friend is teaching them to parallel park this weekend. Cool. LA's entire social scene is literally parking lots now. Drive-ins, drive-thrus, car culture everywhere - everything requires a car. Oh and you don't talk to your date anymore - they're dating that friend they told you not to worry about."
            }
        ]
    },
    {
        year: 1955,
        title: "Disneyland Opens",
        narrative: "July 17, 1955. Walt Disney opens Disneyland in Anaheim, 27 miles from downtown. It's all over TV: 'To all who come to this happy place, welcome.' There's one problem: there's NO rail access. Just a massive parking lot. You need a car to enter the Happiest Place on Earth. This is California's future. Are you ready for tomorrowland?",
        image: "images/disneylandopening.jpg",
        fact: {
            text: "Disneyland opened July 17, 1955 with parking for 12,000 cars but zero rail transit access.",
            link: "https://www.designingdisney.com/parks/disneyland-resort/grand-opening-disneyland/"
        },
        choices: [
            {
                text: "DRIVE TO THE GRAND OPENING",
                requiresFlag: "hasCarGen1",
                effects: { money: -35, frustration: -15 },
                result: "You drive down the Santa Ana Freeway opening day. The parking lot is ENORMOUS. 28,000 people showed up (double what Disney expected). You walk through those gates into the Happiest Place on Earth. Tomorrowland promises a future of flying cars. Everyone around you drove here. California's future is taking shape in this parking lot. Tickets, gas, and a pair of mickey mouse ears: $35."
            },
            {
                text: "TAKE A BUS AND SUFFER",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -25, frustration: 35 },
                result: "You take multiple buses. Three transfers. Over two hours total travel time. You arrive exhausted. Families are piling out of station wagons, fresh and ready for fun. You're already drained and annoyed. Now it's time for more waiting around as you wait in line for entrance to the park. After six hours at the park you face the two-hour bus journey home. So much for this being the happiest place on earth... Bus, tickets, and a pair of mickey mouse ears: $25."
            },
            {
                text: "BUY A CAR FOR MICKEY MOUSE",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1600, monthlyExpenses: 60, frustration: 5, carsOwned: 1 },
                result: "Disneyland makes you realize: California's future is cars-only. No rail. No transit. Just parking lots and freeways. You buy a car so you can go to Disneyland and everything else being built for automobiles only. Walt Disney just pushed you into car dependency. Welcome to Tomorrowland. Car and trip: $1,600.",
                flags: { hasCarGen1: true }
            },
            {
                text: "UH IM A LOONEY TUNES FAN - SKIP DISNEYLAND ENTIRELY",
                effects: { frustration: 45 },
                result: "You skip the grand opening. Can't justify the travel nightmare and you think Bugs Bunny is way cooler than Mickey Mouse. Monday at work EVERYONE is talking about the castle, the rides, how magical it was. You have nothing to say except 'sounds super overrated and a big waste of money.' Everyone at work thinks you're a hater now."
            }
        ]
    },
{
        year: 1959,
        title: "World Series at the Coliseum",
        narrative: "October 1959. The Dodgers are in the World Series against the Chicago White Sox at the Los Angeles Memorial Coliseum! This is the first World Series EVER on the West Coast. Your coworkers are going. Your neighbors scored tickets. Games 3, 4, and 5 are in LA. Over 90,000 fans will pack the Coliseum - a baseball record. This is history. Do you go?",
        image: "images/dodgers.jpg",
        fact: {
            text: "The 1959 World Series was the first ever played on the West Coast. Game 5 drew 92,706 fans to the Memorial Coliseum - still a World Series attendance record. The Dodgers won 4-2, with pitcher Larry Sherry as MVP.",
            link: "https://thisgreatgame.com/1959-baseball-history/"
        },
        choices: [
            {
                text: "DRIVE TO THE COLISEUM",
                requiresFlag: "hasCarGen1",
                effects: { money: -35, frustration: -30 },
                result: "You drive to Exposition Park and find parking near the Coliseum. 92,000 people here - the biggest crowd in World Series history! The energy is electric. Larry Sherry on the mound. The roar when the Dodgers score. You're watching the first West Coast World Series game EVER. You drive home hoarse from screaming, radio replaying the highlights. This is LA baseball history. Tickets, parking, and gas: $35. At work the next day you bring your ticket to show off to everyone. You're one of those people..."
            },
            {
            text: "BUY A CAR TO GO TO THE WORLD SERIES",
            requiresNoFlag: "hasCarGen1",
            effects: { money: -1235, monthlyExpenses: 55, frustration: -20, carsOwned: 1 },
            result: "The World Series is HISTORY and you're not missing it. You buy a used Impala off a lot on Van Nuys Boulevard that week specifically so you can drive to the game. You drive to Exposition Park. 92,000 people here - the biggest crowd in World Series history! The energy is ELECTRIC. Larry Sherry on the mound. The roar when the Dodgers score. You're watching the first West Coast World Series game EVER. You drive home hoarse from screaming, radio replaying the highlights. This is LA baseball history. At work the next day you bring your ticket to show off to everyone. Car, tickets, parking, and gas: $1,235. Monthly costs: $55.",
            flags: { hasCarGen1: true }
            },
            {
            text: "TAKE THE RED CAR TO EXPO PARK",
            requiresNoFlag: "hasCarGen1",
            effects: { money: -18, frustration: -45 },
            result: "You take the Red Car to Exposition Park with thousands of other fans excited to see the game at the Coliseum. The trains are absolutely packed. Everyone's chanting Go Dodgers, Go Dodgers!. You walk into the Coliseum with a sea of blue and white. 92,000 people! The atmosphere is insane. Larry Sherry pitching. The Dodgers WIN! The Red Car ride home is a party - everyone singing, celebrating. The first West Coast World Series and you were THERE. The next day you and your neighnor Frank have a long conversation about how great it was. Tickets, fare, and the dodgers hat you bought on the way there: $45."
            },
            {
                text: "WATCH ON TV AT HOME",
                effects: { money: -5, frustration: 15 },
                result: "You watch on your tiny black and white TV. Vin Scully's iconic voice calling the game through the static. It's exciting but you can HEAR the roar of 92,000 fans through the television speaker and it's making you deeply, spiritually jealous. Your neighbor Frank went and keeps 'casually' mentioning it. 'Oh you know, just the biggest crowd in World Series history, no big deal.' You hate him a little bit right now. He can be SUCH a showoff. Snacks: $5."
            },
            {
                text: "NOT INTO BASEBALL - SKIP IT",
                effects: { frustration: 40 },
                result: "You're not really a baseball person so you skip it. GRAVE ERROR. Monday morning the office is absolutely insufferable. Everyone's re-enacting plays. Someone brought in their ticket stub and people are TOUCHING IT like it's a religious artifact. Your coworker Janet who doesn't even like sports went and now she's best friends with everyone. This was the first World Series ever played on the West Coast and you feel like you're the only person in Los Angeles who missed it. You try to make conversation about the new movie 'North by Northwest,' and your coworker says 'Yes that was amazing but did you see the Dodgers game last night?'"
            }
        ]
    },
    {
        year: 1961,
        title: "The Last Red Car Runs",
        narrative: "March 31, 1963. The last Pacific Electric Red Car makes its final run. The system that connected beaches, mountains, and suburbs for 60 years is dead. General Motors, Standard Oil, and Firestone were literally convicted of conspiracy - they bought the streetcar companies just to destroy them. Now LA has freeways and terrible buses. Car ownership just became mandatory for survival.",
        image: "images/ca-times.brightspotcdn.jpg",
        fact: {
            text: "The last Pacific Electric Red Car ran March 31, 1963. GM, Standard Oil, and Firestone were convicted in 1949 of conspiracy to monopolize transit by destroying streetcar systems across America. LA lost 1,000+ miles of rail.",
            link: "https://www.theguardian.com/cities/2016/apr/25/story-cities-los-angeles-great-american-streetcar-scandal"
        },
        choices: [
            {
                text: "WATCH FROM YOUR CAR",
                requiresFlag: "hasCarGen1",
                effects: { frustration: -10 },
                result: "You watch history end from your driver's seat, parked along the route. People line the tracks taking photographs. Some are openly crying. A few elderly Angelenos who rode these cars their whole lives look devastated. You're glad you bought a car years ago - the writing was on the wall. Later you cruise up to Mulholland, watching the city lights spread out below. Gas is still cheap. Traffic's still moving. For now."
            },
            {
                text: "RIDE THE FINAL RED CAR ONE LAST TIME",
                effects: { frustration: 20 },
                result: "You pack onto the final car with hundreds of nostalgic Angelenos. People are crying. Someone's shooting 8mm film. An old woman tells you about riding to the beach in the '20s for a nickel. This is all history now. Something people will just read about in the future. Now you're stuck with the RTD buses that come whenever they feel like it.",
                forceNext: true
            },
            {
                text: "BUY A CAR IMMEDIATELY - IT'S OVER",
                requiresNoFlag: "hasCarGen1",
                effects: { money: -1200, monthlyExpenses: 55, frustration: 25, carsOwned: 1 },
                result: "The Red Cars are gone. The RTD replacement buses are a joke - they don't go to Venice, they don't go to the Valley, they're always late. You NEED a car now. Not want. NEED. You buy a used Impala off a lot on Van Nuys Boulevard that same week. Welcome to car-dependent Los Angeles. Monthly costs: $55.",
                flags: { hasCarGen1: true }
            }
        ]
    },
    {
        year: 1963.5,
        title: "You Need a Car Now",
        narrative: "The Red Cars are completely gone. The bus system is an absolute disaster - routes don't connect, schedules are unreliable, buses don't reach most of the new suburbs being built. You've been late to work six times this month. Your boss just gave you a final warning. You need a car RIGHT NOW or you're fired.",
        requiresForced: true,
        choices: [
            {
                text: "BUY A CAR (NO CHOICE)",
                effects: { money: -1200, monthlyExpenses: 55, frustration: 30, carsOwned: 1 },
                result: "You drain your savings for a used car. This wasn't a choice. GM and oil companies killed the Red Cars and forced an entire region into car dependency through deliberate corporate conspiracy. They were convicted in court and nobody cared. This is what happens when corporations destroy public infrastructure for profit. Welcome to the new Los Angeles. You're trapped now.",
                flags: { hasCarGen1: true },
                forcedChoice: true
            }
        ]
    },
 {
        year: 1965,
        title: "The Watts Rebellion",
        narrative: "August 11-16, 1965. Watts erupts after police brutality. But the fuel had been building for years. South LA has virtually NO public transit after the Red Cars were eliminated in 1963. Residents can't reach jobs in other parts of the city - unemployment in Watts is 30%, three times the city average. Car ownership costs $1,200+ but has become mandatory for employment. The poorest communities are geographically trapped by infrastructure decisions. The McCone Commission will later identify lack of transportation as a key factor in the uprising.",
        image: "images/wattsrebellion.jpg",
        fact: {
            text: "The 1965 Watts Rebellion was partly fueled by transportation apartheid. After the Red Cars were eliminated, South LA was isolated with minimal bus service. The McCone Commission found that lack of adequate transportation was 'a critical problem' preventing employment access.",
            link: "https://www.history.com/articles/watts-riots"
        },
        choices: [
            {
                text: "YOU HAVE A CAR - REFLECT ON YOUR MOBILITY PRIVILEGE",
                requiresFlag: "hasCarGen1",
                effects: { frustration: -5 },
                result: "You watch it unfold on TV from your living room. You can drive to work anywhere in the city. Your neighbors can drive to the beach on weekends. You're completely insulated from the transit crisis. When the Red Cars existed, Watts residents could reach jobs in downtown, Pasadena, Long Beach for pennies. Now? RTD bus service is sparse, expensive, and doesn't connect to job centers. Without a car, people are trapped. Infrastructure determines who gets opportunity. Oil change: $8."
            },
            {
                text: "READ THE REPORTS AND UNDERSTAND THE SYSTEM",
                effects: { frustration: 20 },
                result: "You read everything. Before 1961, the Red Cars connected Watts to the entire basin - Long Beach factories, downtown offices, Valley aerospace plants. Then GM, Standard Oil, and Firestone (convicted of conspiracy in 1949) destroyed the system. Now? The replacement RTD buses run infrequently, stop at 6pm, don't reach job centers. A car costs more than most Watts families earn in months. This isn't just transportation failure - it's systematic economic isolation. The freeway system was built THROUGH minority neighborhoods, destroying them, while connecting white suburbs. Urban planning as segregation."
            },
            {
                text: "DONATE TO TRANSIT ADVOCACY",
                effects: { money: -100, frustration: 15 },
                result: "You donate to groups fighting to rebuild public transit. They're trying to undo what GM did - restore rail, connect South LA to jobs. But they're fighting billion-dollar oil companies, car manufacturers, tire companies, and a city government that chose freeways over people. Your $100 feels tiny. The Red Cars had 1,000+ miles of track. All gone. It will take decades to rebuild what was destroyed in years. Donation: $100."
            }
        ]
    },
    {
        year: 1969,
        title: "Job Scenario",
        narrative: "",
        image: "",
        choices: []
    },
    {
        year: 1973,
        title: "The Gas Crisis Hits Paradise",
        narrative: "October 1973. OAPEC oil embargo. Gas prices explode overnight from 38¢ to 55¢ per gallon in California. Lines wrap around entire city blocks in LA. Stations run dry by noon. Odd-even rationing by license plate. That convertible freedom dream you bought? Now it's a source of constant anxiety. Car-dependent California is completely vulnerable to Middle East oil politics.",
        image: "images/scpr.brightspotcdn.jpg",
        fact: {
            text: "The 1973 oil embargo hit California especially hard due to complete car dependency. Gas jumped from 38¢ to 55¢ overnight. Lines lasted hours. California had no transit alternatives after the Red Cars were destroyed.",
            link: "https://www.latimes.com/california/story/2023-10-17/1973-arab-oil-embargo-california-gas-crisis"
        },
        choices: [
            {
                text: "WAIT IN GAS LINES FOR HOURS (NO CHOICE)",
                effects: { money: -120, monthlyExpenses: 35, frustration: 55 },
                result: "You wake up at 5:30am trying to beat the crowds. You don't beat the crowds. You wait 90 minutes in the California sun on Sepulveda Boulevard for eight gallons of gas. The engine idles. You're burning gas waiting to buy gas. This happens three times per week. Your monthly costs nearly doubled. That California dream doesn't feel free anymore. You really miss the red cars. Crisis costs: $120, monthly increase: $35.",
                forcedChoice: true
            }
        ]
    }
];

const jobSpecificScenariosLA = {
    factory: {
        year: 1969,
        title: "The Aerospace Plant Moves to Palmdale",
        narrative: "Management calls an all-hands meeting. The aerospace factory is relocating to Palmdale in the high desert - 60 miles north. Cheaper land, room for runway testing, away from 'urban problems.' No transit goes there. Zero. It's car-only access in the middle of nowhere. You HAVE a car but this is a 120-mile daily commute through the desert or moving to tumbleweeds. Cool cool cool.",
        image: "images/LAspace.jpg",
        choices: [
            {
                text: "COMMUTE TO THE DESERT DAILY",
                effects: { money: -95, frustration: 20 },
                result: "Your commute is now 120 miles round trip through the desert. DAILY. You leave at 5:30am. You get home at 7pm. You're spending 3 hours a day staring at the Antelope Valley Freeway wondering where your life went wrong. Gas costs are eating you alive. Your car has become a mobile prison. This is what car-dependent infrastructure created - jobs you can only reach by driving for HOURS. Monthly gas increase: $95."
            },
            {
                text: "MOVE TO PALMDALE - FOLLOW THE WORK",
                effects: { money: -1000, monthlyExpenses: -50, frustration: 30 },
                result: "You move to Palmdale. It's 110 degrees in summer and there's NOTHING out here except aerospace workers and tumbleweeds. Rent's cheaper but you're in the DESERT. No beach. No Sunset Strip. No nothing. And even HERE you need your car for EVERYTHING - the grocery store is 8 miles away. Car dependency followed you to the middle of nowhere. This is your life now. Moving costs: $1000.",
                flags: { movedToSuburbs: true }
            },
            {
                text: "QUIT AND FIND NEW WORK IN LA",
                effects: { money: -600, frustration: 35 },
                result: "You quit rather than commute to the desert or live in the desert. Seemed reasonable at the time. Three months of job hunting later you realize aerospace was the highest-paying work you could get. You find a warehouse job in Vernon for significantly less money. Your friends who moved to Palmdale are buying houses. You're eating ramen. Job search and lost wages: $600."
            }
        ]
    },
    teacher: {
        year: 1969,
        title: "School District Consolidation to the Valley",
        narrative: "LAUSD is restructuring. Your school in downtown LA is overcrowded and underfunded. They're transferring teachers to brand new schools in the San Fernando Valley - Reseda, Van Nuys, Northridge. Modern facilities, air conditioning (!), massive parking lots. Your current downtown school is 10 minutes from your apartment. The Valley schools? 20+ miles and 45 minutes in traffic each way. You have a car but this commute is ROUGH.",
        image: "images/LAschool.jpg",
        choices: [
            {
                text: "TRANSFER TO VALLEY SCHOOL",
                effects: { money: -80, frustration: 25 },
                result: "You transfer to Reseda. The facilities are objectively AMAZING - everything's new, there's air conditioning, the resources are better. But you're now spending 90 minutes a day in your car to teach fifth graders. You leave in the dark, come home in the dark during winter. Car-dependent urban planning means your teaching career now requires burning 2 hours daily in traffic. Is this worth it? Extra gas and wear: $80."
            },
            {
                text: "STAY AT YOUR DOWNTOWN SCHOOL",
                effects: { money: -75, frustration: 25 },
                result: "You stay downtown with your 10-minute commute. But enrollment's dropping FAST as white families flee to the Valley. The school's underfunded, the building's falling apart, and there's serious talk it might close within five years. Meanwhile your friends teaching in the Valley have air conditioning and new textbooks. You kept your short commute but you're watching your school die in real time. School supplies out of pocket: $75."
            },
            {
                text: "LOOK FOR SUBURBAN HOUSING NEAR THE VALLEY SCHOOL",
                effects: { money: -1000, frustration: 30 },
                result: "You transfer to Van Nuys AND start apartment hunting in the Valley to cut the commute. Rent's actually MORE expensive out here than you expected, and you STILL need your car for everything - there's no walking to anything. Apartment hunting and moving costs: $1000."
            }
        ]
    },
    public: {
        year: 1969,
        title: "Budget Showdown: Freeway vs Transit",
        narrative: "You're at a city council budget meeting. LA must choose: complete the Century Freeway (helps thousands of drivers daily, including you) OR restore the bus system funding that got slashed (helps transit riders who are increasingly poor and Black). The auto industry and oil companies are lobbying HARD with briefcases full of money. Transit advocates showed up with a petition. The city only has budget for one. Your vote matters, theoretically.",
        image: "images/LAbuses.jpg",
        choices: [
            {
                text: "VOTE TO SAVE THE BUSES",
                effects: { money: -10, frustration: 35 },
                result: "You vote for buses even though you drive everywhere now. You get absolutely DEMOLISHED 11-1. The freeway wins in a LANDSLIDE. Oil companies and car manufacturers outspent transit advocates 100-to-1. You tried to save transit you don't even use anymore. You failed spectacularly. The system is rigged and you just watched it happen in real time. The bus system will continue its slow death. Meeting lunch: $10."
            },
            {
                text: "VOTE FOR THE FREEWAY - YOU USE IT",
                effects: { money: -10, frustration: 20 },
                result: "You vote for the freeway because honestly... your commute will improve. You drive every day. The buses are for other people now. The freeway passes easily. You drive home on the half-built Century Freeway feeling guilty but also relieved your commute might get shorter. You're complicit in why transit died but car dependency already swallowed you whole. Meeting lunch: $10."
            },
            {
                text: "ABSTAIN - THIS CHOICE SUCKS",
                effects: { money: -10, frustration: 30 },
                result: "You abstain because this whole thing is RIGGED. The freeway wins anyway in a landslide. You drive home on the half-built Century Freeway, passing people waiting at crappy bus stops in 90-degree heat. You're part of the problem now - you NEED the freeway. Corporate lobbying killed public transit and turned you into someone who benefits from its death. Your abstention changed absolutely nothing. Meeting lunch: $10."
            }
        ]
    }
};

const laGen2Scenarios = [
    {
        year: 1980,
        title: "Generation 2: Welcome to Smog City",
        narrative: "Your parents left you a city choked by smog and strangled by freeways. It's 1980 and LA has the worst air quality in America. The brown haze sits over the basin like a curse. You can't see the mountains most days. Your eyes burn. The Red Cars are a distant memory. Everyone drives everywhere. This is the Los Angeles you inherited.",
        image: "images/smog.jpg",
        fact: {
            text: "In 1980, Los Angeles had the worst air pollution in America. Stage 1 smog alerts were common, meaning unhealthy air quality. The city was completely car-dependent.",
            link: "https://waterandpower.org/museum/Smog_in_Early_Los_Angeles.html#:~:text=In%20the%201970s%20and%20'80s,on%20the%20smoggiest%20summer%20days."
        },
        choices: [
            {
                text: "START GENERATION 2",
                effects: { monthlySalary: 1200, monthlyExpenses: 700 },
                result: "You're starting adult life in the smog-choked, freeway-dominated city your parents built. The air hurts to breathe. Traffic is legendary. But it's still LA. The beach is still there. The dream persists. Time to see what choices you have left."
            }
        ]
    },
    {
        year: 1980,
        title: "Your First Baby",
        narrative: "Congratulations - you just had your first baby! Pediatrician is in Santa Monica. Daycare is in Culver City. Your parents are in the Valley. Everything is 15-25 miles apart. You inherited your parents' old car - it's 18 years old, gets 8 miles per gallon, and the smog check inspector gives you a look that says 'this thing is a hazard.' You're about to strap your newborn into it tomorrow.",
        image: "images/girl-car.gif",
        choices: [
            {
                text: "BUY A SAFER, MORE RELIABLE CAR",
                effects: { money: -9000, monthlyExpenses: 380, frustration: -15, carsOwned: 1 },
                result: "You buy a '78 Honda Accord. Better gas mileage. Actually passes smog check. The car seat clicks in. When the engine starts reliably, you feel like a responsible parent. Monthly costs: payment $155, insurance $120, gas $105. The payments hurt but your baby deserves safe transportation in this car-only city."
            },
            {
                text: "KEEP THE OLD BEATER AND PRAY",
                effects: { money: -180, monthlyExpenses: 240, frustration: 25 },
                result: "You strap the car seat into the rust bucket and hope for the best. Every weird engine noise makes your stomach drop. Every time someone cuts you off on the 405, you grip the wheel tighter. The thing barely passes smog check. But you can't afford a new car right now. Monthly costs: insurance $90, gas $150 (it's a gas guzzler)."
            },
            {
                text: "BUY A USED CAR - MIDDLE GROUND",
                effects: { money: -5500, monthlyExpenses: 290, frustration: 5, carsOwned: 1 },
                result: "You find a '76 Toyota with 85,000 miles. Not perfect but way safer than what you had. It actually has working seat belts. Monthly costs: payment $110, insurance $95, gas $85. The baby will probably be fine. Probably."
            }
        ]
    },
    {
        year: 1984,
        title: "The Olympics Are Coming",
        narrative: "LA is hosting the 1984 Summer Olympics and the city is PUMPED. They're widening freeways, building the 105, promising it'll all work perfectly with cars. No new rail transit though - that would be too expensive. The city is betting everything on automobiles handling Olympic crowds. This seems... optimistic?",
        image: "images/LAolympics.jpg",
        fact: {
            text: "The 1984 LA Olympics were car-dependent with no rail transit. The city widened freeways and relied on buses. Somehow it worked due to many locals leaving town, but it reinforced car dependency.",
            link: "https://metroprimaryresources.info/hub/los-angeles-and-the-1984-olympics/"
        },
        choices: [
            {
                text: "VOLUNTEER AT THE OLYMPICS",
                effects: { money: -150, frustration: -20 },
                result: "You volunteer at the Coliseum. The opening ceremony is INCREDIBLE. The whole world is watching LA shine. Carl Lewis wins four gold medals. Mary Lou Retton sticks the landing. The traffic actually isn't terrible because half of LA left town to avoid the crowds. You drive home on empty freeways feeling proud of your city. Gas and parking: $150."
            },
            {
                text: "LEAVE TOWN TO AVOID THE CHAOS",
                effects: { money: -400, frustration: -15 },
                result: "You take two weeks off work and drive up to Big Sur listening to the new Bruce Springsteen album 'Born in the USA' wow that album is good. You stay in Big Sur for two weeks to escape Olympic chaos. The coast is beautiful and you needed this vacation. You return to find out the Olympics went fine and traffic was actually BETTER because everyone had the same idea you did. Big Sur was cool though Trip costs: $400."
            },
            {
                text: "STAY HOME AND WATCH ON TV",
                effects: { money: -50, frustration: 5 },
                result: "You watch from your living room. Safer this way. ABC coverage is actually great. You avoid all the crowds and traffic. But you kind of wish you'd experienced it in person. Your coworkers keep talking about being there, being able to see different events. TV dinners: $50."
            }
        ]
    },
        {
        year: 1986,
        title: "Soccer Practice",
        narrative: "Your 6-year-old wants to play soccer. Great! Healthy! The soccer field is in Culver City - 8 miles away. Practice is Tuesday and Thursday at 4pm. There's no bus. There's no train. There's no carpool organized yet. You work until 5pm. Your partner works until 6pm. American youth sports just became a TRANSPORTATION CRISIS.",
        image: "images/giphy.gif",
        choices: [
            {
                text: "LEAVE WORK EARLY TWICE A WEEK",
                effects: { money: -200, frustration: 30 },
                result: "You leave work at 3:30pm on Tuesdays and Thursdays to drive your kid to soccer. Your boss is NOT HAPPY. You're losing hours and income. But what choice do you have? Your 6-year-old can't drive themselves. You're a chauffeur now. Lost wages: $200/month."
            },
            {
                text: "HIRE SOMEONE TO DRIVE YOUR KID",
                effects: { money: -300, frustration: 20 },
                result: "You hire a neighbor's teenager to pick up your kid from school and drive them to soccer. They drive your kid around in their new ford mustang, dang they have a nicer car than you. For Christmas your 6 year old asks you for the new Metallica 'Masters of Puppets' CD. You like Metallica, but you don't remember playing them around your kid. Who's been playing them Metallica.... Teen driver: $300/month."
            },
            {
                text: "NO TO SOCCER",
                effects: { money: 0, frustration: 40 },
                result: "You tell your kid they can't do soccer. They're devastated and tell you that they hate you. All their friends play soccer. But you CAN'T MAKE IT WORK. They'll remember this forever. You feel like a failure. Your kid resents you. This sucks."
            },
            {
                text: "ORGANIZE A CARPOOL - BECOME A PROJECT MANAGER",
                effects: { money: -100, frustration: 25 },
                result: "You organize a carpool with other parents. This requires FORTY-SEVEN emails, a group chat that never stops, and a shared Google calendar. You drive one day a week. Other parents drive the other days. It WORKS but coordinating it is EXHAUSTING. You're managing logistics like a military operation for children's soccer. Your gas share: $100/month."
            }
        ]
    },
    {
        year: 1987,
        title: "The 405 is a Parking Lot",
        narrative: "Remember when the 405 opened in 1969 and it was glorious? Empty lanes? Fast speeds? Yeah, that's over. It's now one of the most congested freeways in America. Your commute that used to take 30 minutes now takes 90 minutes. You spend 15 hours per week sitting in traffic. This is your life now.",
        image: "images/405.jpg",
        fact: {
            text: "By the late 1980s, the 405 had become one of America's most congested freeways. What was built as a solution became part of the problem - induced demand meant more lanes created more traffic.",
            link: "https://la.curbed.com/2017/2/24/14713510/405-freeway-history-los-angeles"
        },
        choices: [
            {
                text: "JUST ACCEPT THE TRAFFIC HELL",
                effects: { money: -180, frustration: 40 },
                result: "You sit in traffic every single day. 405 southbound at 5pm. Brake lights forever. You've memorized every billboard. You calculate you spend 780 hours per year in traffic - that's 32.5 DAYS of your life sitting in a car not moving. You have 5 albums in your car and you've listened to them all probably 15 times at this point. You too feel like you're living on a prayer. Extra gas from idling: $180/month."
            },
            {
                text: "LEAVE FOR WORK AT 6AM TO BEAT TRAFFIC",
                effects: { money: -120, frustration: 35 },
                result: "You wake up at 5:30am to beat traffic. It works! Your commute is only 35 minutes. But you're exhausted. You're at work by 6:45am with nothing to do until your coworkers arrive at 9am. You're sacrificing sleep for traffic avoidance. This is not sustainable. Coffee habit: $120/month."
            },
            {
                text: "MOVE CLOSER TO WORK",
                effects: { money: -3800, monthlyExpenses: 400, frustration: -20 },
                result: "You move closer to work to escape the 405 nightmare. Rent is way higher but your commute drops to 15 minutes. You gain back 12.5 hours per week. That's time with your family. That's your life back. Moving costs and rent increase: $3,800 upfront, $400/month."
            },
            {
                text: "BECOME A MORNING PERSON WHO WORKS OUT BEFORE WORK I GUESS???",
                effects: { money: -600, frustration: -10 },
                result: "You join a gym near work and start going at 6am. Beat traffic, get fit, arrive at work energized by 8:30am. You're a morning person! You also have a caffine addiction, but don't most of us an you escaped the 405. Gym membership and the red bulls you drink everyday: $600/year."
            }
        ]
    },
   {
    year: 1990,
    title: "Rail Returns After 29 Years!",
    narrative: "July 14, 1990. The Metro Blue Line opens from downtown LA to Long Beach. It's the first rail line in LA since the Red Cars died in 1961. TWENTY-NINE YEARS without rail transit. The stations are clean and shiny. The trains are new. People are crying tears of joy. Maybe LA is finally learning? But it's only one line and it goes to Long Beach. Your job is in Century City. Cool.",
    image: "images/blueline.jpg",
    fact: {
        text: "The Metro Blue Line opened July 14, 1990 - LA's first rail transit in 29 years. It connected downtown to Long Beach, partially following old Red Car routes. A symbolic return after decades of car-only policy.",
        link: "https://thesource.metro.net/the-a-line-blue-turns-30/"
    },
    choices: [
        {
            text: "RIDE THE BLUE LINE OPENING DAY",
            effects: { money: -15, frustration: -20 },
            result: "You ride on opening day. The train is smooth! Fast! CLEAN! Your parents told you about the Red Cars that went nearly EVERYWHERE for a couple of cents. 29 years later that idea is back... but it only goes to Long Beach. It doesn't go to your job. It doesn't go to the beach. It doesn't go to the Valley. It doesn't go to the airport. But hey - it EXISTS! This city might actually learn. In like 30 years. Maybe. Fare and celebration lunch: $15."
        },
        {
            text: "I HAVEN'T USED PUBLIC TRANSIT IN YEARS...I'M NOT STARTING NOW",
            effects: { money: 0, frustration: 10 },
            result: "The Blue Line is objectively great but completely USELESS to you. Your job is in Century City. Your house is in Silverlake. The train goes from downtown to Long Beach. That's it. That's the whole line. Cool for the 47 people whose commute is exactly that route. You're still stuck on the 405 every single day. One rail line connecting two places doesn't fix 30 years of car-only infrastructure. You'd need like 50 more lines before you could ditch your car. See you in 30 years in 2025 maybe...(not)"
        },
        {
            text: "HOPE THIS IS THE START OF SOMETHING BIGGER",
            effects: { money: -50, frustration: -15 },
            result: "You donate $50 to transit advocacy groups who are FIGHTING. The Blue Line proves rail can work in LA! Maybe they'll build the Red Line next. Then the Gold Line. Then the Green Line. Then the Purple Line. Maybe in 30 years there'll be enough coverage that you can actually ditch your car? MAYBE? You're cautiously optimistic . Your friend laughs at you: 'You really think LA will build more trains? After all the money that was poured into the freeways' You choose to believe, but you're not getting rid of your car anytime soon. Donation: $50."
        }
    ]
},
{
    year: 1993,
    title: "Your Partner Needs Their Own Car",
    narrative: "Your partner just got a job offer in Pasadena - way better pay, actual career advancement, benefits that don't suck. It's 18 miles from your house. You work in Century City - opposite direction. You have ONE car between you. Someone's leaving at 7am, someone's leaving at 8:30am. Someone needs to pick up groceries. Someone needs to get the kids. The math doesn't work anymore. LA's sprawl just made two-car households mandatory.",
    image: "images/tenor-1.gif",
    choices: [
        {
            text: "BUY A SECOND CAR",
            effects: { money: -8500, monthlyExpenses: 320, frustration: 20, carsOwned: 1 },
            result: "You buy a second car. A used '89 Toyota Camry. Two insurance payments. Two registrations. Two smog checks. Two cars to maintain. But you both keep your jobs and your sanity. This is what car-dependent sprawl demands - multiple vehicles per household just to function. You're officially a two-car family because LA's infrastructure gave you no choice. At least you don't have to keep fighting over whether to play the new Cranberries album or the new Counting Crows album. Second car: $8,500, monthly costs: $320.",
            flags: { partnerHasCar: true }
        },
        {
            text: "SHARE ONE CAR",
            effects: { money: -150, frustration: 50 },
            result: "You try sharing one car. Wake up at 6:30am to drive your partner to Pasadena, drive back to Century City, work, leave early to pick them up, drive home. You're spending THREE HOURS per day just doing car logistics. Your boss is annoyed you keep leaving early. You're exhausted. You fight constantly about whose job is more important. This is absolutely not sustainable. Extra gas from all the driving: $150/month.",
            forceNext: true
        },
        {
            text: "PARTNER TURNS DOWN THE JOB",
            effects: { money: 0, frustration: 45 },
            result: "Your partner turns down Pasadena to avoid the car nightmare. Better pay, better benefits, better opportunity - all gone because you can't solve the two-job-one-car problem. They're quietly resentful. You're quietly guilty. Car-dependent LA just killed your partner's career advancement because you couldn't afford a second vehicle."
        },
        {
            text: "PARTNER CARPOOLS WITH COWORKER",
            effects: { money: -80, frustration: 30 },
            result: "Your partner carpools with a coworker from Glendale. It works but now they're completely dependent on someone else's schedule. Can't stay late. Can't leave early. Can't take a day off without finding a backup ride. They come home stressed every day. 'My coworker only listens to AM talk radio.' This is barely better than nothing. Monthly gas contribution: $80."
        }
    ]
},
{
    year: 1993.5,
    title: "One Car Doesn't Work Anymore",
    narrative: "Three months of car-sharing hell. You're late to work constantly. Your partner's exhausted from the 6:30am wake-ups. Last week you had a screaming match in the driveway about whose meeting was more important. The neighbor called to check if you were okay. You're not okay. You need a second car immediately or someone's quitting their job.",
    image: "images/kermit.gif",
    requiresForced: true,
    choices: [
        {
            text: "BUY A SECOND CAR (NO CHOICE)",
            effects: { money: -8500, monthlyExpenses: 320, frustration: 35, carsOwned: 1 },
            result: "You drain your savings for a second car. Now you're a two-car household whether you planned for it or not. Two payments. Two insurance bills. Two gas tanks. LA's car-dependent sprawl just forced you into mandatory multi-car ownership. This is the only way dual-income families survive in Los Angeles. The system has you trapped. Second car: $8,500, monthly costs: $320.",
            flags: { partnerHasCar: true },
            forcedChoice: true
        }
    ]
},
{
    year: 1994,
    title: "The Northridge Earthquake",
    narrative: "January 17, 1994. 4:31am. You're asleep. The Northridge earthquake hits - 6.7 magnitude. You wake up to your entire apartment SHAKING. Books flying off shelves. Car alarms screaming. When the sun comes up, you turn on the news: freeway overpasses COLLAPSED. The 10. The 5. The 14. Sections of freeway are just GONE. Crumpled like paper. The car-dependent city's entire infrastructure is shattered. Your one-hour commute now takes FOUR HOURS on surface streets. The whole city is paralyzed. KTLA is showing the collapsed freeway on loop.",
    image: "images/earthquake.jpg",
    fact: {
        text: "The 1994 Northridge earthquake collapsed multiple freeway sections including the I-10 and I-5. LA's complete car dependency meant total paralysis. Repairs cost billions and took over a year.",
        link: "https://metroprimaryresources.info/why-the-northridge-quake-was-a-defining-moment-for-transit/16368/"
    },
    choices: [
        {
            text: "SUFFER THROUGH COMMUTES DAILY",
            effects: { money: -250, frustration: 60 },
            result: "You drive THREE HOURS each way on surface streets for SIX MONTHS while they rebuild the freeways. Eight hours a day in your car. Your ENTIRE LIFE is traffic now. You leave at 6am in darkness. You get home at 8pm in darkness. You see your family for 45 minutes before bed. You're ashamed of how many times you've listened to Weezer by Weezer. `Say it ain't so, ${gameState.character.firstName}...`Your back hurts. Your soul hurts. LA's car dependency just became a waking nightmare with no escape. Extra gas from idling in traffic: $250/month."
        },
        {
            text: "CARPOOL WITH COWORKERS",
            effects: { money: -150, frustration: 50 },
            result: "You organize a carpool with three coworkers to split gas costs and use the carpool lane. It helps a LITTLE - you're down to three hours each way instead of four. But now you're trapped in a car with Brad who won't stop talking about his new Gateway 2000 computer. And Susan who insists on listening to Hootie and the Blowfish on repeat. And Mike who brings tuna sandwiches. You're losing your mind. The carpool lane is still a parking lot. Your gas share: $150/month."
        },
        {
            text: "QUIT AND FIND A JOB CLOSER TO HOME",
            effects: { money: -1200, frustration: 30 },
            result: "The earthquake breaks you completely. You quit after two weeks of four-hour commutes and start job hunting. Takes two months to find something within five miles of home. The pay is less but you can get there in 15 minutes even WITHOUT freeways. You can see your family again! You can eat dinner at a normal hour! The earthquake taught you that LA's car infrastructure is one disaster away from total collapse. Job search costs: $1,200."
        },
        {
            text: "MOVE CLOSER TO WORK IMMEDIATELY",
            effects: { money: -4500, monthlyExpenses: 350, frustration: -15 },
            result: "You move within three miles of work within a MONTH. Can't do this anymore. Rent is $350/month higher but you can make it on surface streets in 15 minutes. You're FREE from the freeway nightmare. The earthquake taught you that LA built everything on a fragile system that can collapse literally overnight. You're hedging against the next earthquake. Or fire. Or riot. Or whatever infrastructure hell comes next. Moving costs: $4,500, rent increase: $350/month."
        }
    ]
},
 {
    year: 1998,
    title: "Teenager Needs Car for Their Job",
    narrative: "Your 16-year-old just got their license and landed a part-time job at the Glendale Galleria - 14 miles away. They need to work Tuesday and Thursday nights plus weekends. You work until 6pm. Your partner works until 7pm. The mall is car-only access with zero bus service that goes there. Your teenager literally cannot have a job without a car. They keep playing that Fastball song 'The Way' on repeat in their room. American teenage employment just became a transportation crisis.",
    image: "images/clueless.gif",
    choices: [
        {
            text: "BUY THEM A USED CAR",
            effects: { money: -6500, monthlyExpenses: 280, frustration: -10, carsOwned: 1 },
            result: "You buy them a baby blue '95 Nissan Maxima with 35,000 miles. They're THRILLED. They immediately take it for a spin and blast 'Everybody (Backstreet's Back)' at full volume. They can get to work at RadioShack, see friends at the Third Street Promenade, have actual independence. But now you're paying teen insurance rates ($230/month - OUCH) plus their gas money. Your household just became a multi-car family because LA infrastructure demanded it. Your teen names the car 'Bubbles' after the Powderpuff Girls. Car: $6,500, monthly costs: $280.",
            flags: { teenHasCar: true }
        },
        {
            text: "BECOME THEIR PERSONAL CHAUFFEUR",
            effects: { money: -150, frustration: 45 },
            result: "You become your teenager's personal driver. Leave work early Tuesdays and Thursdays. Drive them to the Galleria. Pick them up at 9pm. Your boss is NOT HAPPY. You're exhausted. Your teen is HUMILIATED getting dropped off while their friends pull up in their own cars blasting TLC. They won't even let you park near the entrance. You have to drop them off around the corner. This isn't sustainable. Extra gas from chauffeur duty: $150/month.",
            forceNext: true
        },
        {
            text: "THEY QUIT THE JOB",
            effects: { money: 0, frustration: 40 },
            result: "They quit the job. Can't make the transportation work. All their friends have cars from their parents AND jobs at the mall. Your kid is the only one stuck at home watching TRL on MTV because they can't drive themselves anywhere. They wanted to save up for the new iMac. Now they're broke and carless and FURIOUS at you. Car-dependent LA just robbed your teenager of employment and independence. They blast Alanis Morissette's 'You Oughta Know' passive-aggressively through their bedroom door."
        },
        {
            text: "SHARE YOUR CAR",
            effects: { money: -120, monthlyExpenses: 120, frustration: 50 },
            result: "You try sharing ONE car between the two of you. The scheduling is IMPOSSIBLE. Constant screaming matches in the driveway about whose needs are more important. Every single morning you turn on the car and Third Eye Blind's 'Semi-Charmed Life' EXPLODES at full volume because your teen left it blasting. You're having a heart attack at 7am to 'DOO DOO DOO, DOO DOO-DOO DOO.' At least they have good music taste. Gas increase: $120/month."
        }
    ]
},
{
    year: 1998.5,
    title: "The Chauffeur Schedule Failed",
    narrative: "Three months of being your teenager's personal taxi service. Your boss is DONE with you leaving early. Your teen refuses to be seen with you anymore - last week you tried to wave at them in the parking lot and they literally pretended not to know you. You're completely exhausted. Last night you fell asleep at 8:30pm during Seinfeld. There's no other option anymore. You HAVE to buy them a car.",
    image: "images/annoyedparent.gif",
    requiresForced: true,
    choices: [
        {
            text: "BUY THEM A CAR (NO CHOICE)",
            effects: { money: -6500, monthlyExpenses: 280, frustration: 30, carsOwned: 1 },
            result: "You scrape together money for a beater. A '94 Toyota Corolla with a tape deck. Your teenager can FINALLY get to work independently. They immediately drive to Tower Records and buy the Titanic soundtrack. But you just became a multi-car household because LA's car-dependent infrastructure gave you absolutely no alternative. Teen employment literally requires car ownership in Los Angeles. That's just the reality of sprawl. Car: $6,500, monthly costs: $280.",
            flags: { teenHasCar: true },
            forcedChoice: true
        }
    ]
}
];

const laGen3Scenarios = [
 {
    year: 2004,
    title: "You Need a Car Immediately",
    narrative: "Your job starts Monday in Century City. You're crashing with a friend in Echo Park temporarily. That's 12 miles. The bus takes 90 minutes with two transfers. You literally cannot function in LA without a car. This isn't a lifestyle choice - it's infrastructure forcing your hand. Time to drain your savings.",
    image: "images/needcar.jpg",
    choices: [
        {
            text: "BUY A USED CAR",
            effects: { money: -14000, monthlyExpenses: 520, frustration: -10, carsOwned: 1 },
            result: "You buy a used 2001 Honda Civic with 80,000 miles. The previous owner left a Usher 'Confessions' CD stuck in the player. 'Yeah!' plays every time you start the car. Down payment drains $4,000 of your savings. Monthly costs: payment $250, insurance $380 (under 25 in LA is BRUTAL), gas $140. You just spent $14,000 you didn't have on something you need to participate in basic life. Your friend from college calls - they're taking the T in Boston to work - and you have to explain that LA doesn't work that way. Welcome to mandatory car dependency. Car: $14,000.",
            flags: { hasCarGen3: true }
        },
        {
            text: "LEASE A NEW CAR",
            effects: { money: -3000, monthlyExpenses: 680, frustration: -5, carsOwned: 1 },
            result: "You lease a brand new 2004 Civic at the dealership. The salesman's playing Outkast's 'Hey Ya!' and you're shaking it like a Polaroid picture. That new car smell hits different. Down payment: $3,000. Monthly: lease payment $380, insurance $450, gas $150. You're locked into payments but the car is RELIABLE. You just entered the infinite car payment cycle that traps Americans for life. Lease: $3,000 down.",
            flags: { hasCarGen3: true }
        },
        {
            text: "TRY PUBLIC TRANSIT",
            effects: { money: -75, monthlyExpenses: 75, frustration: 45 },
            result: "You take the bus. 90 minutes each way. THREE HOURS of your day evaporated. You're reading 'The Da Vinci Code' on the bus because what else are you gonna do. You're late to work three times in two weeks because buses just don't show up. Your boss is losing patience. Your friend keeps asking when you're moving out because you're always home late eating their Hot Pockets and watching Arrested Development. Dating? Impossible - everything is too far. This isn't sustainable. Monthly bus pass: $75.",
            forceNext: true
        }
    ]
},
{
    year: 2004.5,
    title: "Public Transit Failed - You Need a Car",
    narrative: "Three months of bus hell. You've been late to work constantly. You missed a friend's birthday in Manhattan Beach because the bus doesn't go there. Someone cute suggested drinks in Pasadena and you had to decline because the transit logistics were impossible. You're buying a car TODAY. LA's infrastructure just forced your hand.",
    requiresForced: true,
    choices: [
        {
            text: "BUY A CAR (NO CHOICE LEFT)",
            effects: { money: -14000, monthlyExpenses: 520, frustration: 30, carsOwned: 1 },
            result: "You buy a used car with money you don't have. The dealer's playing Maroon 5's 'This Love' and honestly it feels appropriate because you do NOT love this situation. LA's infrastructure just forced you into car ownership and debt. The lack of functional transit isn't consumer choice - it's policy failure creating mandatory expenses. Welcome to car-dependent Los Angeles. You're trapped in the system now. Your boss sees you pull up in your new car and goes 'FINALLY.' Car: $14,000.",
            flags: { hasCarGen3: true },
            forcedChoice: true
        }
    ]
},
{
    year: 2009,
    title: "Lakers NBA Finals",
    narrative: "June 14, 2009. Lakers are playing Game 5 of the NBA Finals at Staples (6pm). Dodgers playing at Chavez Ravine (7:10pm). Everyone is driving to both stadiums at the same time. Downtown to Echo Park. The 110 is a parking lot. Sunset Boulevard isn't moving. Even surface streets are gridlocked. This is what happens when a city has zero transit alternatives and two major sporting events happen 3 miles apart.",
    image: "images/kobe.gif",
    choices: [
        {
            text: "DRIVE TO THE LAKERS GAME",
            effects: { money: -280, frustration: 65 },
            result: "You leave at 4:30pm for a 6pm tipoff. You sit on the highway for AN HOUR not moving. You're blasting 'I Gotta Feeling' by the Black Eyed Peas trying to manifest a good time. You're sweating. Screaming at no one. The guy next to you is honking like that helps ANYTHING. You finally run into Staples Center at 6:45pm - missed the ENTIRE first quarter. Kobe already has 15 points and you saw NONE of it. Tickets, parking, gas: $280."
        },
        {
            text: "TAKE METRO TO STAPLES",
            effects: { money: -95, frustration: 45 },
            result: "You take the Red Line to Staples! It actually WORKS! The game is incredible! Lakers WIN🏆 You're celebrating! Then you want to hit up a bar in Los Feliz with friends to keep celebrating. Metro doesn't go there. Last train already left anyway. You Uber for $35. Transit got you 90% of the way there. The last-mile problem absolutely destroyed you. You're home by 1am spending way more than if you'd just driven. Uber, ticket, and beers: $95."
        },
        {
            text: "WATCH AT HOME",
            effects: { money: -60, frustration: 30 },
            result: "You watch from your couch. Lakers win! Kobe! Pau! You want to celebrate downtown where thousands of people are going CRAZY. But the traffic... You stay home ordering Domino's and watching the celebrations on TV while texting your friends who are actually there. You missed a once-in-a-lifetime championship celebration happening 8 miles from your apartment. Food delivery: $60."
        },
        {
            text: "GO TO A SPORTS BAR",
            effects: { money: -75, frustration: -10 },
            result: "You walk to a sports bar in your neighborhood. When the Lakers win, the ENTIRE BAR ERUPTS. Beer flying. People jumping. You're hugging complete strangers. Someone starts blasting 'We Are the Champions.' You walk home at midnight happy and slightly drunk. Sometimes the local option is the BEST option. You didn't sit in traffic and you still celebrated. Bar tab: $75."
        }
    ]
},
{
    year: 2011,
    title: "Carmageddon",
    narrative: "July 15-17, 2011. They're closing a 10-mile stretch of the 405 for 53 hours to demolish the Mulholland Bridge. The media dubs it 'CARMAGEDDON.' Mayor Villaraigosa warns everyone: STAY HOME or the city will be completely gridlocked. JetBlue literally offers $4 flights from Burbank to Long Beach to avoid driving through the closure. This is what happens when you build a city with zero transit alternatives - one freeway closure becomes an apocalyptic event.",
    image: "images/carmagedon.jpg",
    fact: {
        text: "Carmageddon (July 2011) closed 10 miles of the 405 for 53 hours. The city feared total gridlock. JetBlue offered $4 flights across the closure. LA's car dependency made a single freeway closure sound like the end times.",
        link: "https://www.theguardian.com/world/2011/jul/17/carmageddon-los-angeles-freeway-demolition"
    },
    choices: [
        {
            text: "STAY HOME ALL WEEKEND",
            effects: { money: -90, frustration: -10 },
            result: "You stock up on groceries Friday and don't leave your neighborhood for 53 HOURS. You're imprisoned by car infrastructure failure. Your friend's birthday party in Venice? Can't go - 405 is closed. Beach day? Impossible. You drive to your local Walmart and rent 4 DVDs from the Redbox: 'Bridesmaids,''Scott Pilgrim vs The World,' 'Black Swan', and 'Despicable Me' a very random quartet. One freeway closure trapped you in your house. Groceries and Redbox DVDs: $90."
        },
        {
            text: "TAKE THE $4 JETBLUE FLIGHT ",
            effects: { money: -55, frustration: -5 },
            result: "You actually buy JetBlue's $4 publicity stunt ticket from Burbank to Long Beach to visit your friend. Thirty miles by car. Twenty minutes by plane. The ABSURDITY. You're FLYING over a freeway closure. You post it on Facebook and everyone thinks it's hilarious. The fact that FLYING is more practical than driving proves how catastrophically broken LA infrastructure is. This is dystopian comedy. Flight, Uber to friend's place, and In-N-Out: $55."
        },
        {
            text: "BIKE ACROSS THE EMPTY 405",
            effects: { money: -25, frustration: -25 },
            result: "You bike across the closed 405. It's MAGICAL. No cars. Just people. Families. Kids on scooters. Dogs everywhere. Someone's playing 'Party Rock Anthem' on a speaker. You see what the freeway STOLE - this 10-mile stretch could have been a park or a trail. For 53 hours you glimpse what LA could be without car dependency. It's really nice actually. Then Monday morning it reopens and you're back in traffic. You'll never forget this moment. Bike rental and water: $25."
        },
        {
            text: "DRIVE SURFACE STREETS",
            effects: { money: -70, frustration: 60 },
            result: "You ignore the warnings and try to drive to the Westside anyway. What should be a 25-minute drive takes THREE HOURS. You're listening to Adele's '21' album on repeat and crying along. 'We could have had it alllll.' One freeway closure paralyzed 10 million people because there's NO transit alternative. This is what car dependency looks like when it breaks. Gas and your sanity: $70."
        }
    ]
},
{
    year: 2013,
    title: "BFF's Vegas Wedding",
    narrative: "Your college best friend is getting married in Las Vegas. You're invited! It's 270 miles away - basically the same distance as NYC to Boston. But there's NO TRAIN. Like actually zero passenger rail service. Your options: drive 4-5 hours through the desert (gas + hotel), fly for 1 hour ($200+), or take a Greyhound for 6 hours ($80). American infrastructure is so broken that visiting a city 270 miles away requires either driving or flying. Europe is laughing at us.",
    image: "images/vegasladriving.png",
    fact: {
        text: "LA to Vegas is 270 miles with zero passenger rail service. Amtrak's Desert Wind was discontinued in 1997. Despite decades of proposals, there's still no train connection as of 2025. Brightline West finally broke ground in 2024 but won't open until 2028-2029.",
        link: "https://www.brightlinewest.com/"
    },
    choices: [
        {
            text: "DRIVE TO VEGAS",
            effects: { money: -350, frustration: 25 },
            result: "You drive through the Mojave Desert for 5 hours listening to the 'Frozen' soundtrack because your niece left it in your car. 'Let it gooooo' on repeat through Barstow. The wedding is fun! Sunday you drive 5 hours back. You spent 10 hours of your weekend behind a wheel for a wedding. In Europe, you'd take a 2-hour train. In America, you burn $100 in gas and destroy your lower back. Gas, hotel, and wedding gift: $350."
        },
        {
            text: "FLY TO VEGAS",
            effects: { money: -420, frustration: 20 },
            result: "You fly from LAX. The flight is 50 minutes but between getting to LAX early, security, waiting, and getting from Vegas airport to the Strip, it's basically 4 hours anyway. You're literally flying to a city that's the same distance as a decent train ride. The wedding is great! You fly home Sunday. American infrastructure failure turned a 270-mile trip into a $420 flight. Flight, Uber, and gift: $420."
        },
        {
            text: "TAKE THE GREYHOUND BUS",
            effects: { money: -180, frustration: 50 },
            result: "You take Greyhound to save money. SIX HOURS on a bus. The AC is broken. Someone's eating an entire rotisserie chicken next to you. You're watching 'The Hunger Games: Catching Fire' on your iphone 5 to escape reality. The wedding is lovely! The bus ride back Sunday is THE SAME HELL. Twelve hours on Greyhound for a weekend wedding. Bus, hotel, and gift: $180."
        },
        {
            text: "SKIP THE WEDDING",
            effects: { money: -100, frustration: 60 },
            result: "You skip it. The transportation options are ALL terrible. You send a generous gift and apologetic text. Your friend is hurt you're not coming. Monday you see all the wedding photos on Facebook. Everyone had an amazing time. You weren't there for your best friend's wedding. What kind of friend are you... Gift that won't make your absense any better: $100."
        }
    ]
},
{
    year: 2016,
    title: "Dating in LA: Geography Problem",
    narrative: "You matched on Hinge. Great conversation. Real chemistry happening through the screen. They suggest dinner in Venice Beach. You live in Los Feliz. That's 18 miles - could be 35 minutes, could be 90 minutes depending on traffic. It's Friday night so definitely 90 minutes. They have a car obviously because everyone does. In LA, dating compatibility is literally: chemistry × (distance ÷ traffic) = relationship viability. You're doing math on potential love.",
    image: "images/hinge.gif",
    choices: [
        {
            text: "DRIVE TO VENICE",
            effects: { money: -85, frustration: 25 },
            result: "You leave at 6:30pm for 8pm dinner. Sit in traffic for 75 minutes listening to Beyoncé's 'Lemonade' album. Finally arrive. The date is AMAZING. They're funny, hot, extremely into you. You stay until midnight talking. Drive home takes only 35 minutes - LUCKY! But then they mention they love hiking in Malibu on weekends and their favorite brunch spot is in Pasadena. Every future date requires traffic calculus and GPS coordination. Is this sustainable? TBD. Dinner, parking, gas: $85."
        },
        {
            text: "SUGGEST SILVER LAKE",
            effects: { money: -50, frustration: 5 },
            result: "You counter-propose a cafe in Silver Lake. Equal-ish drive time for both of you! They agree! The date is genuinely great. The food is perfect. Then they casually mention 'yeah all my favorite spots are on the Westside' and you see the future: one of you will ALWAYS be in traffic for this relationship. Maybe it works. Maybe geography wins. You're not sure yet. At least the pasta was good. Dinner: $50."
        },
        {
            text: "CANCEL",
            effects: { frustration: 55 },
            result: "You cancel. Ninety minutes of Friday night traffic for a first date with a stranger? ABSOLUTELY NOT. They seem annoyed by your cancellation text. You watch their Instagram stories all weekend having fun without you. Car-dependent LA geography just murdered another potential relationship before it even started. You order Postmates Thai food and watch 'Stranger Things' alone instead. You're fine. Everything's fine."
        },
        {
            text: "SUGGEST COFFEE FIRST",
            effects: { money: -18, frustration: 10 },
            result: "You suggest coffee in WeHo first - 20 minutes from both of you. Test the vibe before committing to Venice traffic! They agree. The coffee date is good! You schedule dinner for next week. SMART MOVE. Never commit to Venice Friday night traffic for someone you haven't met in person. This is LA Dating Strategy 101. Coffee and parking: $18."
        }
    ]
},
{
    year: 2018,
    title: "Car is Your Second Home",
    narrative: "You just did the depressing math: 15 hours per week in your car. That's 780 hours per year. 32.5 DAYS of your entire life annually just sitting in traffic not moving. Your car has snacks, phone chargers, deodorant, a full change of clothes, breath mints, sunscreen, a blanket. You've eaten full meals in it. Taken work calls. Cried. Had revelations. Your car isn't transportation anymore - it's a $720/month second home you're forced to maintain just to participate in LA life.",
    image: "images/worsttraffic.jpg",
    fact: {
        text: "LA drivers average 119 hours per year stuck in traffic - the most in America.",
        link: "https://www.cnbc.com/2019/09/04/commuters-in-this-city-spend-119-hours-a-year-stuck-in-traffic.html"
    },
    choices: [
        {
            text: "UPGRADE THE SETUP IN YOUR CAR",
            effects: { money: -850, frustration: -10 },
            result: "You buy a premium phone mount, lumbar support seat cushion, Spotify Premium subscription, and better speakers. If you're spending 32.5 DAYS per year here, might as well be comfortable right? You make a 'Car Jams' playlist. You listen to 'This American Life' podcasts in traffic and become very informed. You listen to everything. You know the lyrics to every Ariana Grande song ever. Even the stuff from 'Victorious.' Car upgrades: $850."
        },
        {
            text: "MOVE CLOSER TO WORK",
            effects: { money: -5200, monthlyExpenses: 600, frustration: -30 },
            result: "You move within 3 miles of work. Rent jumps $600/month but your commute drops to 8 minutes. You get 13 hours per week BACK. That's 676 hours per year - 28 DAYS OF YOUR LIFE recovered. You can go to the gym now. Cook dinner. See friends. Read books. You're literally paying rent money to buy your TIME back from car dependency. Your life is yours again. Worth every penny. Moving costs and deposit: $5,200."
        },
        {
            text: "JUST ACCEPT IT - THIS IS JUST LA",
            effects: { money: 0, frustration: 10 },
            result: "This is just LA. Everyone lives like this. You listen to every podcast. You know every KROQ DJ personally at this point. You've consumed every episode of 'Welcome to Night Vale.' You're slowly going insane but you keep telling yourself 'it could be worse.' Could it...? As we've just established LA drivers spend the MOST time in traffic."
        }
    ]
},
{
    year: 2020,
    title: "COVID",
    narrative: "March 2020. The world stops. LA goes completely silent. The 405 at rush hour is EMPTY. You can see the San Gabriel Mountains from downtown for the first time in your entire life. The smog is just GONE. People are skateboarding down the middle of the 110 freeway. The air smells... clean? What is this smell? This is what LA looks like without car dependency. It's absolutely beautiful. It's haunting. This is what was stolen from you and you didn't even know it until now.",
    image: "images/lacovid.jpg",
    fact: {
        text: "During COVID lockdown, LA air quality improved dramatically. PM2.5 pollution dropped 31%. The San Gabriel Mountains were clearly visible from downtown for the first time in decades.",
        link: "https://newsroom.ucla.edu/releases/air-quality-a-year-after-covid-lockdowns"
    },
    choices: [
        {
            text: "DRIVE THE EMPTY FREEWAYS",
            effects: { money: -45, frustration: -35 },
            result: "You drive the 10 from Santa Monica to downtown at 5pm. NO TRAFFIC. You're going 75mph. You're CRYING. This is what the freeways were SUPPOSED to be in 1952. This is the California dream they promised your grandparents. For three beautiful months you experience what was stolen from you by car dependency. You're listening to 'The Weeknd' and watching the mountains and you're thinking 'oh my god THIS is what it was supposed to be.' Then everyone comes back and it's over. Gas: $45."
        },
        {
            text: "REALIZE YOU DON'T NEED THE CAR - SELL IT",
            effects: { money: 8000, monthlyExpenses: -720, frustration: -25, carsOwned: -1 },
            result: "You haven't driven in two months. Everything's DoorDash delivered. You're working from home watching 'Tiger King' with everyone else in America. The car sits completely unused in your parking spot collecting dust. You sell it for $8,000 and immediately save $720/month. You're FREE! You can breathe! Maybe when the world reopens you can stay car-free? (You absolutely could not. This was a HUGE mistake and you're about to learn that very soon.) Sold: $8,000.",
            flags: { soldCarGen3: true, hasCarGen3: false }
        },
        {
            text: "ESCAPE TO JOSHUA TREE",
            effects: { money: -3600, frustration: -30 },
            result: "You rent an Airbnb in Joshua Tree for three months. Remote work means you can be ANYWHERE! You hike every morning watching the sunrise. The stars at night are INSANE. You're making sourdough bread and posting it on Instagram like everyone else in quarantine. You see the desert your grandparents saw before LA sprawled across the entire basin. You're using your car to escape car culture. The irony is not lost on you. Three months in the desert: $3,600."
        },
        {
            text: "STAY IN LA AND WATCH THE CITY BREATHE",
            effects: { money: -2400, frustration: -20 },
            result: "You stay home in LA. You watch from your balcony as the city BREATHES for the first time in 60 years. The mountains are visible EVERY SINGLE DAY. You bike down the middle of completely empty streets. This is what the city could be without cars. You're baking banana bread and doing Chloe Ting workouts and learning TikTok dances. When cars return in a few months, you'll never forget what you saw. Rent and groceries: $2,400."
        }
    ]
},
{
    year: 2021,
    title: "Return to Office",
    narrative: "Your company announces return to office. You sold your car during COVID thinking remote work was THE FUTURE FOREVER. Oops! Used car prices are UP 42% from pre-pandemic. That car you sold for $8,000 in 2020? Now costs $13,000+ for something similar. You need a car IMMEDIATELY or you literally can't get to work. The car dependency trap you escaped for 18 beautiful months just snapped shut again. Welcome back to hell.",
    image: "images/returntooffice.jpg",
    requiresFlag: "soldCarGen3",
    choices: [
        {
            text: "BUY AN OVERPRICED CAR",
            effects: { money: -18000, monthlyExpenses: 740, frustration: 50, carsOwned: 1 },
            result: "You buy a used 2018 model at inflated pandemic prices. The dealer is playing Olivia Rodrigo's 'drivers license' and you want to scream. Down payment: $5,000. That car you sold for $8,000 in 2020? Now costs $13,000 for something WORSE. You LOST $5,000 by selling during COVID. Monthly: payment $360, insurance $480 (still brutal), gas $180. You're trapped in the car dependency system forever now. There's literally no escape. Car: $18,000.",
            flags: { hasCarGen3: true }
        },
        {
            text: "LEASE A NEW CAR",
            effects: { money: -4000, monthlyExpenses: 780, frustration: 45, carsOwned: 1 },
            result: "You lease a new 2021 Toyota since used prices are completely INSANE. Down payment: $4,000. Monthly: lease $450, insurance $480, gas $180. You're locked into car payments for LIFE now. You're trapped in the system that destroyed public transit decades ago and forces car ownership forever. The American Dream is a monthly payment trap you can never escape. Lease: $4,000.",
            flags: { hasCarGen3: true }
        }
    ]
},
{
    year: 2023,
    title: "Taylor Swift Eras Tour at SoFi",
    narrative: "August 2023. Taylor Swift's Eras Tour at SoFi Stadium in Inglewood. SIX sold-out nights. 70,000 Swifties per show descending on Inglewood. The 405 is a parking lot from LAX to the Valley. The 10 isn't moving. Surface streets completely gridlocked. People are spending 3+ HOURS driving 15 miles in their best sparkly outfits. Taylor starts at 7pm. Fans are still stuck in traffic at 8:30pm missing 'Cruel Summer.' This is what car dependency looks like when it collapses under glitter and friendship bracelets.",
    image: "images/erastour.gif",
    choices: [
        {
            text: "DRIVE TO SOFI",
            effects: { money: -650, frustration: 70 },
            result: "You leave at 4:30pm for a 7pm show wearing your carefully planned Reputation-era outfit. You're blasting '1989' getting HYPED. You sit on the 405 for TWO AND A HALF HOURS. NOT. MOVING. You switch albums to 'Folklore' because now your crying. You finally sprint into SoFi at 8:00pm - Taylor's ALREADY performed 'Cruel Summer' AND 'Lover' AND 'The Man.' You spent $200 on tickets to miss the first half hour of TAYLOR SWIFT. Your outfit is wrinkled from sitting. Car dependency just ruined the Eras Tour for you. Tickets, parking, gas, and your themed outfit: $350."
        },
        {
            text: "UBER THERE",
            effects: { money: -525, frustration: 65 },
            result: "You Uber from Echo Park. SURGE PRICING MASSACRE: $80 each way because EVERYONE had your same idea. You're sitting in the SAME traffic as the cars but at least you can make friendship bracelets in the backseat. Your driver is playing 'Anti-Hero' and you're living it. Still miss the first 30 minutes. After the show, Uber wants $100 to get home because 70,000 people are leaving simultaneously. You pay it. This single concert cost you $525 total. You could've bought SO MUCH merch. Instead you funded Uber's executive bonuses. Uber, tickets, and a much needed drink: $525."
        },
        {
            text: "TAKE METRO THEN SHUTTLE",
            effects: { money: -615, frustration: 55 },
            result: "You take Metro to Expo/Crenshaw in your full 'Midnights' era outfit then the official SoFi shuttle. The shuttle sits in the EXACT SAME TRAFFIC. You're on a bus for 90 minutes going 12 miles while Swifties around you are freaking out about missing 'You Belong With Me.' You miss 'Cruel Summer' AND 'Lover.' After the show, the shuttle line is TWO HOURS long. People are trading friendship bracelets in line. You give up and Uber home for $85. Transit tried its best. Metro, shuttle, Uber, and ticket: $515."
        },
        {
            text: "WATCH LIVESTREAM AT HOME",
            effects: { money: -40, frustration: 75 },
            result: "You can't do it. The traffic reports are showing APOCALYPTIC scenes. You watch a blurry TikTok livestream from your apartment. TAYLOR SWIFT is performing 12 miles away but might as well be in space like Katy Perry. You're watching your friends' Instagram stories from inside SoFi - they're singing 'All Too Well (10 Minute Version)' - while you sit home alone eating ice cream. You know these are 'champagne problems' but you still 'knew LA would be trouble' and you two 'are never ever getting back together'. Multiple pints of ice cream: $40."
        }
    ]
},
{
    year: 2024,
    title: "The K Line Opens - Too Late For You",
    narrative: "October 2024. The K Line (Crenshaw/LAX) FINALLY opens after years of delays and cost overruns. It connects Expo Line to SoFi Stadium and LAX! This would have been LIFE-CHANGING for Beyoncé last year! Except... it doesn't go where YOU actually need to go. Your job is in Century City. Your apartment is in Los Feliz. The K Line goes from Crenshaw to Inglewood. Cool for those people. You're still spending $740/month on your car for a commute the train doesn't serve.",
    image: "images/kline.jpg",
    fact: {
        text: "The K Line opened October 2024, connecting Expo Line to SoFi and LAX. While a major expansion, LA's rail still doesn't serve most commute patterns - only 10% of LA trips are accessible by Metro.",
        link: "https://www.latimes.com/california/story/2024-10-24/l-a-waited-so-long-it-seemed-like-a-fantasy-but-its-actually-coming-a-rail-connection-to-lax"
    },
    choices: [
        {
            text: "RIDE THE K LINE OPENING DAY",
            effects: { money: -60, frustration: -15 },
            result: "You ride the K Line opening day with thousands of hopeful Angelenos. The trains are CLEAN. They're fast! They go to LAX finally! Maybe LA is actually learning from 70 years of mistakes? Maybe in 20 more years there'll be enough rail coverage that you can ditch your car? MAYBE? You're cautiously optimistic for the first time in a while. But tomorrow morning you're still driving to work. Nothing actually changed for you personally. Day trip and lunch: $60."
        },
        {
            text: "IT DOESN'T HELP YOU",
            effects: { money: -740, frustration: 25 },
            result: "The K Line is objectively great but completely USELESS for your actual life. Your daily commute from Los Feliz to Century City still requires driving. More transit is good for LA but the city built car dependency SO DEEP that a few rail lines can't undo 60 years of car-only infrastructure. You're still spending $740/month on car ownership. The system has you trapped. Probably forever. Monthly car costs: $740."
        },
        {
            text: "MOVE TO K-TOWN AND TRY CAR-FREE LIFE",
            effects: { money: -6500, monthlyExpenses: 400, frustration: 25, carsOwned: -1 },
            result: "You move to Koreatown near Purple/Red Lines and SELL YOUR CAR. Rent increases $500/month but you save $740/month on car costs. You're net POSITIVE $240/month! You're living car-free in LOS ANGELES! You post about it on Twitter and people think you're either brave or insane. Except... your job is still far. Dating is way harder. Costco is completely impossible. Visiting friends requires Uber. You're playing life on hard mode. You knew this going in. Moving costs: $6,500.",
            flags: { soldCarGen3: true, hasCarGen3: false }
        }
    ]
},
{
    year: 2025,
    title: "75 Years: Was It Worth It?",
    narrative: `Three generations of Los Angeles, ${gameState.character.firstName}. The California Dream evolved. Let's see what it became.`,
    image: "images/la2025sunset.gif",
    choices: [
        {
            text: "SEE HOW YOUR LA STORY ENDED",
            effects: {},
            result: "You completed 75 years in Los Angeles. Your grandparents: rode Red Cars for a dime (Santa Monica to Pasadena to Long Beach!), bought a house for $12,000, saw the San Gabriel Mountains every single day, smelled orange blossoms in the air, went to the first West Coast World Series at the Coliseum, lived in actual paradise. Your parents: sat in 405 traffic listening to KROQ, breathed smog so thick they couldn't see the mountains for years, survived the Northridge earthquake that collapsed freeways, lived through the '92 riots while listening to Dr. Dre and Ice Cube tell the real story, watched the Blue Line open in 1990 and thought 'finally!' (it went to Long Beach, cool), paid for cars their entire lives while the Red Cars rotted in memory. You: spend thousands a year on mandatory car ownership, missed part of Taylor Swift's Eras Tour because of SoFi traffic, spend 32.5 DAYS per year just SITTING in your car not moving listening to Kendrick's entire discography multiple times (you've contemplated your whole life to 'HUMBLE.' in traffic), survived Carmageddon, watched COVID clear the smog and finally saw the mountains your grandparents saw every day. The city destroyed 1,000+ miles of rail and built freeways that immediately jammed. The K Line finally opened in 2024 but doesn't go where you need. Brightline to Vegas won't open until 2028. BUT - In-N-Out is still fire, the tacos from that truck on your corner are ELITE, it's 75° in January while the rest of America freezes, you've got Shohei Ohtani AND Freddie Freeman, LeBron and Luka (Thank you Nico Harrison), the Rams won the Super Bowl at SoFi in 2022, Kendrick won the Pulitzer and multiple Grammys repping Compton, and the beaches are still there. Your grandparents had affordable housing, clean air, functioning transit, and paradise. You have... traffic, debt, perfect weather, and the Dodgers who seem unstopable."
        }
    ]
}
];

scenarios.nyc = {
    gen1: nycGen1Scenarios,
    gen2: nycGen2Scenarios,
    gen3: nycGen3Scenarios,
};

scenarios.la = {
    gen1: laGen1Scenarios,
    gen2: laGen2Scenarios,
    gen3: laGen3Scenarios,
};

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
    
if (gameState.currentGeneration === 1 && (gameState.city === 'detroit' || gameState.city === 'nyc' || gameState.city === 'la')) {
    const jobScenario = gameState.city === 'detroit' ? 
        jobSpecificScenarios[gameState.character.job] : 
        gameState.city === 'nyc' ?
        jobSpecificScenariosNYC[gameState.character.job] :
        jobSpecificScenariosLA[gameState.character.job];
    
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
    const annualIncome = gameState.monthlySalary * 12 * yearsElapsed;
    gameState.money += annualIncome;
    
    const annualExpenses = gameState.monthlyExpenses * 12 * yearsElapsed;
    gameState.money -= annualExpenses;
}

document.getElementById('current-year').textContent = Math.floor(scenario.year);
document.getElementById('current-generation').textContent = `Generation ${gameState.currentGeneration}`;
document.getElementById('scenario-title').textContent = scenario.title;
    
   let narrativeText = scenario.narrative;
if (scenario.title === "Welcome to Detroit" || scenario.title === "Welcome to New York City" || scenario.title === "Welcome to Los Angeles") {
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
    
 if (choice.effects.money) {
    gameState.money += choice.effects.money;
}

if (choice.effects.monthlyExpenses) {
    gameState.monthlyExpenses += choice.effects.monthlyExpenses; 
}

if (choice.effects.monthlySalary) {
    if (choice.effects.monthlySalary > 1000) {
        gameState.monthlySalary = choice.effects.monthlySalary;
    } else {
        gameState.monthlySalary += choice.effects.monthlySalary; 
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
    const modal = document.querySelector('.result-modal');
    if (modal) {
        modal.remove();
    }
    updateGameStats();

    gameState.currentScenarioIndex++;
    
    setTimeout(() => {
        loadScenario();
    }, 100);
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
