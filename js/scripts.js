document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#reverse-calculation-form');
    const billTotal = document.querySelector('#bill-total');
    const billConsumption = document.querySelector('#bill-consumption');
    const result = document.querySelector('#reverse-result');
    const resultMessage = document.querySelector('#reverse-result-message');
    const consumptionLevel = document.querySelector('#reverse-consumption-level');
    const consumptionTips = document.querySelector('#consumption-tips');
    const consumptionTipsList = document.querySelector('#consumption-tips-list');
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
});
