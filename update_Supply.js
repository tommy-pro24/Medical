var config = {
    onGameTitle: { label: 'Supply 10X (latest) 1/29/2025 :: 7:21:PM', type: 'title' },
    Amount: { label: "Amount", value: (currency.amount / 3).toFixed(2), type: "number" },
    Bet: { label: "Bet", value: 0, type: "number" },
    limit: { label: "Round limit", value: 26, type: "number" }
};

function main() {
    const g_StartDate = new Date();
    const initialAmount = currency.amount;  // Store initial amount
    let g_Money = config.Amount.value || (initialAmount / 3);  // 1/3 of initial amount
    let g_Bet = config.Bet.value || currency.minAmount;
    let g_baseBet = config.Bet.value || currency.minAmount;
    let g_Payout = 10.0;
    let g_History = [];
    let WS = {
        events: 0,      // Total rounds played
        combos: 0,      // Consecutive losses
        sSum: 0,        // Sum of bet multipliers
        rSum: 0,        // Running sum of bets
        tg: 0,          // Total profit/loss
        roundCount: 0,  // Count of rounds in current session
        totalLoss: 0    // Total amount lost in current session
    };
    let CV = {
        limit: config.limit.value,  // 26 rounds
        payout: 10.0,
        gainX: 9
    };

    Initialize();
    game.onBet = function () {
        game.bet(g_Bet, g_Payout).then(function (payout) {
            countgame(payout);
            g_Wager >= CV.payout ? playWin() : playLoss();
            printResult(payout);
            stopGame();
            updateBetPayout(payout);
        }).catch(function (error) {
            log.info(error.message);
            WriteTime(g_StartDate);
        });
    };

    function Initialize() {
        log.info("New game start.");
        log.success(new Date().toLocaleString());
        log.info('.  ');

        // Reset session variables
        WS.roundCount = 0;
        WS.tg = 0;
        WS.combos = 0;
        WS.sSum = 0;
        WS.rSum = 0;
        WS.totalLoss = 0;

        // Calculate base bet to ensure total of all bets is exactly g_Money
        // For 26 rounds with 1.05x multiplier (adjusted to reach exactly $23.33)
        const totalRounds = CV.limit;
        const targetSum = g_Money;
        const r = 1.05; // Adjusted multiplier for each round

        // Calculate sum of geometric series: S = a * (r^n - 1) / (r - 1)
        // where a = base bet, r = multiplier, n = number of rounds
        const sum = (Math.pow(r, totalRounds) - 1) / (r - 1);
        g_baseBet = config.Bet.value || f2s(targetSum / sum);

        updateBetPayout(1);
    }

    function countgame(payout) {
        WS.events++;
        WS.roundCount++;
        g_Wager = game.history[0].odds;
        g_Wager >= CV.payout ? WS.combos = 0 : WS.combos++;
        g_History.unshift(g_Wager);
        if (g_History.length > 600) g_History.pop();

        if (g_Wager >= CV.payout) {
            WS.rSum = 0;
            WS.totalLoss = 0;
            logAlarm("Found the 10X. new bet start.");
        }
    }

    function playWin() {
        WS.tg += g_Bet * (g_Payout - 1);
    }

    function playLoss() {
        WS.tg -= g_Bet;
        WS.totalLoss += g_Bet;
    }

    function stopGame() {
        // Check if we've played 26 rounds
        if (WS.roundCount >= CV.limit) {
            logGameResult('26 rounds completed. Starting new session.');
            Initialize();
            return;
        }

        // Check if we've won enough to cover all losses
        if (WS.tg >= 0) {
            logGameResult('Profit target reached. Starting new session.');
            Initialize();
            return;
        }

        // Check if we've lost our allocated amount
        if (g_Money + WS.tg <= 0) {
            logGameResult('Session amount lost. Starting new session.');
            Initialize();
            return;
        }
    }

    function updateBetPayout(payout) {
        g_Payout = CV.payout;

        // Calculate bet using geometric progression with 5% increase
        // This ensures the sum of all 26 bets equals exactly g_Money
        g_Bet = f2s(g_baseBet * Math.pow(1.05, WS.combos));

        WS.rSum += g_Bet;
    }

    function logGameResult(m) {
        log.info('.  ');
        log.info(`***** ${m} *****`);
        WriteTime(g_StartDate);
        log.info('.  ');
    }

    function logAlarm(m) {
        log.info('.  ');
        log.info(`***** ${m} *****`);
    }

    function printResult(payout) {
        let msg = `Rounds: ${WS.roundCount}/${CV.limit}, C= ${WS.combos}, B=${f2s(g_Bet)}, P= ${g_History[0]}X, Profit= ${f2s(WS.tg)}`;
        if (g_Wager >= CV.payout) msg += ` ----- |||||`;
        log.info(msg);
    }

    function WriteTime(dt) {
        var curDate = new Date();
        var diff = calculateTimeDifference(dt);
        log.info(" Now " + curDate.toLocaleString() + " : Elapsed time " + diff);
    }

    function f2s(p) {
        return parseFloat(p).toFixed(2);
    }

    function calculateTimeDifference(dt) {
        const diff = (new Date() - dt) / 1000;
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        return `${h}:${m}`;
    }
} 