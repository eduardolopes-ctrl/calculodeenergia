document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#consumption-form');
    const residentCount = form.querySelector('#resident-count');
    const previousConsumption = form.querySelector('#previous-consumption');
    const result = document.querySelector('#result');
    const resultIcon = document.querySelector('#result-icon');
    const resultLabel = document.querySelector('#result-label');
    const resultTitle = document.querySelector('#result-title');
    const resultSummary = document.querySelector('#result-summary');
    const estimatedConsumption = document.querySelector('#estimated-consumption');
    const estimatedCost = document.querySelector('#estimated-cost');
    const projectedConsumption = document.querySelector('#projected-consumption');
    const projectedCost = document.querySelector('#projected-cost');
    const tipsHeading = document.querySelector('#tips-heading');
    const tipsList = document.querySelector('#tips-list');
    const tariff = Number(form.dataset.tariff);
    const governmentFees = 14;

    const currency = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    const number = new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 2
    });

    document.querySelector('#tariff-display').textContent = currency.format(tariff);

    function updateResult() {
        const consumption = Number(previousConsumption.value);
        const residents = Number(residentCount.value);
        if (
            previousConsumption.value === '' ||
            !Number.isFinite(consumption) ||
            consumption < 0 ||
            residentCount.value === '' ||
            !Number.isInteger(residents) ||
            residents < 1
        ) {
            result.hidden = true;
            return;
        }

        const consumptionPerResident = consumption / residents;
        const cost = consumption * tariff + governmentFees;
        const projectedKwh = consumption * 0.9;
        const projectedBill = projectedKwh * tariff + governmentFees;
        const consumptionLevel = consumptionPerResident <= 100
            ? 'baixo'
            : consumptionPerResident <= 300
                ? 'médio'
                : 'alto';
        result.className = `result result--${consumptionLevel}`;
        resultIcon.textContent = '✓';
        resultLabel.textContent = `Seu consumo por pessoa está ${consumptionLevel}`;
        resultTitle.textContent = 'Análise da conta de energia';
        const residentDescription = `${residents} ${residents === 1 ? 'pessoa' : 'pessoas'}`;
        resultSummary.textContent =
            `${number.format(consumptionPerResident)} kWh por pessoa/mês, considerando ${residentDescription}. ` +
            'As contas estimadas incluem R$ 14,00 de taxas do governo.';
        estimatedConsumption.textContent = `${number.format(consumption)} kWh/mês`;
        estimatedCost.textContent = currency.format(cost);
        projectedConsumption.textContent = `${number.format(projectedKwh)} kWh/mês`;
        projectedCost.textContent = currency.format(projectedBill);
        const tipsByLevel = {
            baixo: {
                heading: 'Dicas para manter o consumo baixo',
                tips: [
                    'Apague as luzes ao sair dos cômodos e aproveite a iluminação natural.',
                    'Evite deixar aparelhos ligados sem necessidade.'
                ]
            },
            médio: {
                heading: 'Dicas para economizar',
                tips: [
                    'Reduza o tempo de banho e use o chuveiro na posição morna quando possível.',
                    'Desligue luzes e aparelhos quando não estiverem em uso.',
                    'Junte roupas para usar a máquina de lavar com carga completa.'
                ]
            },
            alto: {
                heading: 'Dicas para reduzir o consumo',
                tips: [
                    'Revise os aparelhos que mais consomem energia e reduza o tempo de uso, especialmente do chuveiro e do ar-condicionado.',
                    'Desligue luzes e aparelhos quando não estiverem em uso e evite deixá-los em modo de espera.',
                    'Aproveite a luz natural e lave roupas com a máquina cheia.'
                ]
            }
        };
        const tips = tipsByLevel[consumptionLevel];
        tipsHeading.textContent = tips.heading;
        tipsList.replaceChildren(...[
            ...tips.tips,
            'A projeção de 10% é apenas uma referência; o resultado depende dos hábitos da casa e da tarifa real.'
        ].map((tip) => {
            const item = document.createElement('li');
            item.textContent = tip;
            return item;
        }));
        result.hidden = false;
    }

    form.addEventListener('input', updateResult);
    form.addEventListener('change', updateResult);
});
