function montarPaginaClassificacao() { 
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var boleiros = planilhaParaBoleiros(planilha);
  
  var paginaClassificacao = planilha.getSheetByName("Classificação");  
  var cabecalhoClassificacao = new Array();
  var dadosClassificacao = new Array();
  var indiceRodadaAtual = boleiros.indiceRodadaAtual();
  var numeralRodadaAtual = parseInt(indiceRodadaAtual) + 1;
  
  cabecalhoClassificacao.push("Classificação", "Boleiro", "Pontos", "Placares", "Rodada Atual: " + numeralRodadaAtual + "ª\n pt - pl");
  for(var linCon = 1; linCon < boleiros.quatidade() + 1; linCon++) {
    var colunaCon = [];
    var boleiro = boleiros.pegarPorIndice(linCon -1);
    colunaCon.push(boleiro.nome(), boleiro.pontos(), boleiro.placares(), boleiro.pegarRodadaPorIndice(indiceRodadaAtual).resultado());
    dadosClassificacao.push(colunaCon);
  }
  
  // ordenar o array
  dadosClassificacao.sort(boleiros.ordenarPorPlacares);
  dadosClassificacao.sort(boleiros.ordenarPorPontos); 
  
  var dadosOrdenados = new Array();
  var posicao = 1; 
  var colors = [];  
  
  colors.push(["#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC"]);
  
  for(var ord in dadosClassificacao) {
    ord = parseInt(ord);
    var linha = dadosClassificacao[ord];
    
    if(ord === 0) {
      var classificacao = parseInt(posicao) + "º";       
      linha.unshift(classificacao);      
      dadosOrdenados.push(linha);
      posicao++;
      colors.push(["#75A551", "#75A551", "#75A551", "#75A551", "#75A551"]);
      continue;
    }    
    
    var pontosAnteriores = dadosClassificacao[ord - 1][2];
    var pontosCorrente = linha[1];
    
    var placaresAnteriores = dadosClassificacao[ord - 1][3];
    var placaresCorrente = linha[2];
    
    if((pontosAnteriores === pontosCorrente) && (placaresAnteriores === placaresCorrente)) {
      var classificacao = parseInt(posicao - 1) + "º";       
      linha.unshift(classificacao);
      dadosOrdenados.push(linha);
      
      // verifica necessidade de cor de fundo verde
      if(((posicao - 1) === 1) || ((posicao - 1) === 2)) {
        colors.push(["#75A551", "#75A551", "#75A551", "#75A551", "#75A551"]);
      }
      else {
        colors.push(["white", "white", "white", "white", "white"]);
      }
      continue;
    }    
    
    var classificacao = parseInt(posicao) + "º";       
    linha.unshift(classificacao);
    
    // verifica necessidade de cor de fundo verde
    if((posicao === 1) || (posicao === 2)) {
      colors.push(["#75A551", "#75A551", "#75A551", "#75A551", "#75A551"]);
    }
    else {
      colors.push(["white", "white", "white", "white", "white"]);
      
      // verifica necessidade de cor de fundo vermelho
      if(ord === dadosClassificacao.length -1) {        
        for(var corReb = ord; corReb > 0; corReb--) {
          if((corReb === ord) || (corReb === ord - 1)) {
            colors[corReb + 1] = ["#FF5252", "#FF5252", "#FF5252", "#FF5252", "#FF5252"];
            continue;
          }
          
          if(dadosClassificacao[corReb][0] === dadosClassificacao[corReb + 1][0]) {
            colors[corReb + 1] = ["#FF5252", "#FF5252", "#FF5252", "#FF5252", "#FF5252"];
          }
          else {
            break;
          }                  
        }
      }
    }
    
    posicao++;
    dadosOrdenados.push(linha);    
  };
  
  dadosOrdenados.unshift(cabecalhoClassificacao);  
  
  var intervaloClassificacao = paginaClassificacao.getRange(1,1,dadosOrdenados.length,cabecalhoClassificacao.length);   
  intervaloClassificacao.setValues(dadosOrdenados);
  intervaloClassificacao.setBackgrounds(colors);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function montarPaginaRodada() { 
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var boleiros = planilhaParaBoleiros(planilha);
  
  var paginaRodadas = planilha.getSheetByName("Rodadas");   
  var cabecalho = [];
  var dados = [cabecalho];
  
  paginaRodadas.clearContents();
  

  
  for(var lin =0; lin < boleiros.quatidade(); lin++) {
    var coluna = [];
    var boleiro = boleiros.pegarPorIndice(lin);
    for(var col = 0; col < boleiro.numeroRodadas(); col++) {     
      var rodada = boleiro.pegarRodadaPorIndice(col);
      
      if(lin === 0) {
        if(col === 0) {
          cabecalho.push("Boleiro");
        }
        cabecalho.push(rodada.nome());
      }
      if(col === 0) {
        coluna.push(boleiro.nome());        
      }
      
      coluna.push(rodada.resultado());    
    }    
    dados.push(coluna);
  } 
  var intervalo = paginaRodadas.getRange(1,1,dados.length,cabecalho.length);
  intervalo.setValues(dados);
  
  
//   SpreadsheetApp.flush();                   
// // pause (1,000 milliseconds = 1 second)          
// Utilities.sleep("200");                             
//
// // delete empty rows at bottom
// var last = mSheet.getLastRow();                     
// var max  = mSheet.getMaxRows();
// if (last !== max) {mSheet.deleteRows(last+1,max-last);}
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function planilhaParaBoleiros(planilha) {
  var paginas = planilha.getSheets(); 
  var boleiros = new Boleiros();
  
  for(var i =0; i < paginas.length; i++) {
    var nome = paginas[i].getName();
    if(boleiros.ehBoleiro(nome)) {
      var boleiro = new Boleiro(nome);
      var pontos = paginas[i].getSheetValues(2, 10, 380, 1);
      
      for(var rod = 1; rod < 39; rod++) {
        var rodada = new Rodada(rod + "ª Rodada\npt - pl");
        var pontosNaRodada = pontos.splice(0, 10);
        rodada.calcularPontos(pontosNaRodada);
        rodada.calcularPlacares(pontosNaRodada);
        boleiro.inserirRodada(rodada);
      }
      boleiros.adicionar(boleiro);
    }
  }
  return boleiros;
}

function zebrarRodadas() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet(),
  paginas = planilha.getSheets(),
  nomePaginaRodada = "Rodadas",
  PAGINAS_CONTROLE = ["Classificação"];
  
  
  var cor = "write"
  for(var pag =0; pag < paginas.length; pag++) {
    var nome = paginas[pag].getName();
    if(PAGINAS_CONTROLE.indexOf(nome) === -1) {
      
      var colors = [],
      cont = 0,
      alternarParaBranco,
      alternarParaCinza,
      rod,
      colors,
      coresBranca,
      coresCinza,
      coresCabecalho;
      
      
      if(nome === nomePaginaRodada) {
        rod = paginas[pag].getRange(1, 1, 25, 39);
        alternarParaBranco = 1;
        alternarParaCinza = 2;
        coresCabecalho = ["#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC"];
        coresBranca = ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white"];
        coresCinza = ["#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9"];
        
      }      
      else {
        rod = paginas[pag].getRange(1, 1, 382, 10);
        alternarParaBranco = 10;
        alternarParaCinza = 20;
        coresCabecalho = ["#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC"];
        coresBranca = ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white"];
        coresCinza = ["#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9", "#D9D9D9"];
      }
        
      colors.push(coresCabecalho); 
      for(var i = 0; i < paginas[pag].getLastRow(); i++) {
        
        cont++;              
        if(cont <= alternarParaBranco) {
          colors.push(coresBranca);          
        }
        else {
          colors.push(coresCinza);
        }
        if(cont == alternarParaCinza) {
          cont = 0;
        }
      }
      rod.setBackgrounds(colors);
    }
  }
}
