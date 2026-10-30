document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#reverse-calculation-form');
    const billTotal = document.querySelector('#bill-total');
    const billConsumption = document.querySelector('#bill-consumption');
    const result = document.querySelector('#reverse-result');
    const resultMessage = document.querySelector('#reverse-result-message');
    const consumptionLevel = document.querySelector('#reverse-consumption-level');
    const consumptionTips = document.querySelector('#consumption-tips');
    const consumptionTipsList = document.querySelector('#consumption-tips-list');
    const applianceForm = document.querySelector('#appliance-questionnaire');
    const applianceResult = document.querySelector('#appliance-result');
    const applianceResultHeading = document.querySelector('#appliance-result-heading');
    const applianceRankingList = document.querySelector('#appliance-ranking-list');
    const curiosityText = document.querySelector('#energy-curiosity-text');
    const nextCuriosityButton = document.querySelector('#energy-curiosity-next');
    const curiosities = [
        'Uma lâmpada de LED pode usar até 80% menos energia que uma lâmpada incandescente para produzir uma quantidade parecida de luz.',
        'Um aparelho de 1.500 W ligado por uma hora consome 1,5 kWh. A potência e o tempo de uso juntos ajudam a estimar o gasto.',
        'Um chuveiro de 5.500 W usado por 10 minutos por dia consome cerca de 27,5 kWh em 30 dias.',
        'Abrir a geladeira muitas vezes ou deixar a porta aberta por muito tempo faz o aparelho trabalhar mais para recuperar a temperatura.',
        'O consumo indicado na etiqueta do aparelho é uma estimativa de teste. O uso real varia com o modelo, a instalação e os hábitos da casa.'
    ];
    let curiosityIndex = 0;
    const applianceEstimates = {
        shower: { name: 'Chuveiro elétrico', consumption: 165 },
        'air-conditioner': { name: 'Ar-condicionado', consumption: 120 },
        refrigerator: { name: 'Geladeira', consumption: 56 },
        freezer: { name: 'Freezer', consumption: 50 },
        dryer: { name: 'Secadora de roupas', consumption: 60 },
        'washing-machine': { name: 'Máquina de lavar', consumption: 15 },
        'electric-oven': { name: 'Forno elétrico', consumption: 15 },
        computer: { name: 'Computador', consumption: 30 },
        microwave: { name: 'Micro-ondas', consumption: 10 },
        television: { name: 'Televisão', consumption: 13 },
        lighting: { name: 'Lâmpadas LED', consumption: 15 }
    };
    const tipsByLevel = {
        baixo: [
            'Meça por alguns dias os aparelhos que ficam ligados direto (como modem, TV e computador) com um medidor de tomada. Some os kWh medidos antes de decidir o que vale desligar.',
            'Na geladeira, confira a vedação da porta e deixe espaço para ventilação conforme o manual. Vedação ruim ou pouca circulação de ar faz o compressor trabalhar mais.',
            'Compare o consumo em kWh de uma fatura para outra, não só o valor em reais: tarifas e bandeiras podem subir mesmo quando você usa a mesma quantidade de energia.'
        ],
        médio: [
            'Se usa chuveiro elétrico de 5.500 W todos os dias, reduzir 5 minutos por banho representa cerca de 14 kWh a menos no mês. O impacto aparece especialmente nos banhos longos.',
            'Se usa ar-condicionado, experimente 23–24 °C, limpe o filtro na frequência indicada pelo fabricante e vede frestas. Assim o aparelho precisa remover menos calor para manter o conforto.',
            'Use um medidor de tomada compatível para descobrir o consumo real de equipamentos com ciclos, como computador e aquecedor de aquário. Anote os kWh por uma semana para priorizar os maiores.'
        ],
        alto: [
            'Faça um mini diagnóstico por sete dias: anote o kWh do medidor sempre no mesmo horário e registre quando usa chuveiro, ar-condicionado ou secadora. Os dias de maior variação ajudam a encontrar o principal gasto.',
            'Se o ar-condicionado aparece nessa rotina, ajuste para 23–24 °C, mantenha portas e janelas fechadas e limpe os filtros conforme o manual. Compare o consumo de uma semana antes e depois.',
            'Chuveiro elétrico e secadora concentram muita potência. Teste reduzir alguns minutos de uso e agrupar ciclos de secagem; por exemplo, um chuveiro de 5.500 W usado 5 minutos a menos por dia economiza cerca de 14 kWh no mês.'
        ]
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const total = Number(billTotal.value);
        const consumption = Number(billConsumption.value);
        if (
            billTotal.value === '' ||
            !Number.isFinite(total) ||
            total <= 0 ||
            billConsumption.value === '' ||
            !Number.isFinite(consumption) ||
            consumption <= 0
        ) {
            result.className = 'reverse-result reverse-result--error';
            resultMessage.textContent = 'Preencha os dois campos com valores maiores que zero para calcular.';
            consumptionLevel.textContent = '';
            consumptionTips.hidden = true;
            result.hidden = false;
            return;
        }

        const pricePerKwh = total / consumption;
        const level = consumption <= 100
            ? 'baixo'
            : consumption <= 300
                ? 'médio'
                : 'alto';
        const levelDescription = {
            baixo: 'baixo (até 100 kWh/mês)',
            médio: 'médio (acima de 100 até 300 kWh/mês)',
            alto: 'alto (acima de 300 kWh/mês)'
        };

        result.className = `reverse-result reverse-result--${level}`;
        resultMessage.textContent =
            `O valor médio da sua energia é ${pricePerKwh.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por kWh.`;
        consumptionLevel.textContent =
            `Seu consumo mensal de ${consumption.toLocaleString('pt-BR')} kWh está ${levelDescription[level]}.`;
        consumptionTipsList.replaceChildren(...tipsByLevel[level].map((tip) => {
            const item = document.createElement('li');
            item.textContent = tip;
            return item;
        }));
        consumptionTips.hidden = false;
        result.hidden = false;
    });

    applianceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedAppliances = [...applianceForm.querySelectorAll('input[name="appliances"]:checked')]
            .map((input) => applianceEstimates[input.value])
            .sort((first, second) => second.consumption - first.consumption);

        applianceRankingList.replaceChildren();
        if (selectedAppliances.length === 0) {
            applianceResultHeading.textContent = 'Marque pelo menos um aparelho para ver o resultado.';
            applianceResult.hidden = false;
            return;
        }

        applianceResultHeading.textContent = 'Os que mais podem consumir na sua casa:';
        applianceRankingList.replaceChildren(...selectedAppliances.map((appliance, index) => {
            const item = document.createElement('li');
            item.className = 'appliance-ranking-item';

            const position = document.createElement('span');
            position.className = 'appliance-position';
            position.textContent = String(index + 1).padStart(2, '0');
            position.setAttribute('aria-hidden', 'true');

            const details = document.createElement('div');
            const name = document.createElement('h4');
            name.textContent = appliance.name;
            const estimate = document.createElement('p');
            estimate.textContent = `Cerca de ${appliance.consumption} kWh/mês`;
            details.append(name, estimate);
            item.append(position, details);
            return item;
        }));
        applianceResult.hidden = false;
    });

    nextCuriosityButton.addEventListener('click', () => {
        curiosityIndex = (curiosityIndex + 1) % curiosities.length;
        curiosityText.textContent = curiosities[curiosityIndex];
    });
});
