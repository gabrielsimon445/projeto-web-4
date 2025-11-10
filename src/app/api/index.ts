export async function getDolar() {
  const dia = new Date().toLocaleDateString();
  const [day, month, year] = dia.split("/");

  try {
    const res = await fetch(
      `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${month}-${day}-${year}'&$top=100&$format=json&$select=cotacaoCompra`
    );
    const data = await res.json();
    if (data.value && data.value.length > 0) {
      const cotacao: string = data.value[0].cotacaoCompra;
      return cotacao;
    } else {
      return "Cotação não encontrada";
    }
  } catch (err) {
    console.log(err);
  }
}

export interface cotacao {
  BTCUSD: {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: string;
  };
  ETHUSD: {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: string;
  };
}

export async function getCripto() {
  try {
    const res = await fetch(
      `https://economia.awesomeapi.com.br/json/last/BTC-USD,ETH-USD`
    );
    const data = await res.json();
    if (data) {
        const cotacao: cotacao = data;
      return cotacao; // retorna como string
    } else {
      return "Cotação não encontrada";
    }
  } catch (err) {
    console.log(err);
  }
}
