//############################### GATILHOS ########################################################################
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Classificação", functionName: "montarPaginaClassificacao"}, {name: "Rodadas", functionName: "montarPaginaRodada"}, {name: "Zebrar Rodadas", functionName: "zebrarRodadas"}];
  ss.addMenu("Atualizar", menuEntries);
}

function atualizarClassificacao() {
  montarPaginaClassificacao();  
}
