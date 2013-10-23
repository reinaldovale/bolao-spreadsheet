function Boleiros() {
  
  /* propriedades privadas */
  var boleiros = [];
  
  /* métodos públicos */
  
  this.indiceRodadaAtual = function() {
    var indiceRodadaAtual = 0;
    var ultimaRodada = boleiros[0].numeroRodadas() - 1;
    for(var bo in boleiros) {
      var boleiro = boleiros[bo];
      var candidataRodadaAtual = boleiro.indiceCandidataRodadaAtual();
      if(indiceRodadaAtual < candidataRodadaAtual) {
        indiceRodadaAtual = candidataRodadaAtual;
      }
    }
    var t = 0;
    return ((indiceRodadaAtual === 0) || (indiceRodadaAtual === ultimaRodada)) ? indiceRodadaAtual : indiceRodadaAtual -1;
  }
  
  this.ordenarPorPontos = function (a, b) {
    return b[1] - a[1];
  };

  this.ordenarPorPlacares = function (a, b) {
    return b[2] - a[2];
  }
  
  this.ehBoleiro = function(pagina) {
    var PAGINAS_CONTROLE = ["Classificação", "Gabarito", "Rodadas", "Novo"];
    var t = (PAGINAS_CONTROLE.indexOf(pagina) != -1)?false:true;
    return (PAGINAS_CONTROLE.indexOf(pagina) != -1)?false:true;
  };
  
  this.pegarRodadaAtual = function() {
    return rodadas[self.indiceRodadaAtual()];
  }
  
  this.adicionar = function(boleiro) {
    boleiros.push(boleiro);
  };

  this.pegarPorIndice = function(indice) {
    return boleiros[indice]; 
  };   
  
  this.quatidade = function() {
    return boleiros.length; 
  };  
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Boleiro (nome) {
  var self = this,
      nome = nome,      
      atual = false,
      rodadas = [];
  
  this.nome = function() {
    return nome;
  };
  
  this.pontos = function() {
    var pts = 0;
    for(var rod in rodadas) {
      pts = pts + rodadas[rod].pontos();
    }
    return pts;
  };
  
  this.placares = function() {
    var pls = 0;
    for(var rod in rodadas) {
      pls = pls + rodadas[rod].placares();
    }
    return pls;
  };
  
  this.numeroRodadas = function() {
   return rodadas.length;
  };
  
  this.inserirRodada = function(rodada) {
    rodadas.push(rodada);
    Logger.log(rodadas.length);
  };
  
  this.pegarRodadaPorIndice = function(indice) {
    return rodadas[indice]; 
  };
  
  this.indiceCandidataRodadaAtual = function() {
    for(var rod = 0; rod < rodadas.length; rod++) {
      var rodada = rodadas[rod];
      if(rodada.pontos() === 0) {
        return rod;
      }      
    }
  };
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function Rodada (nome) {
  var nome = nome,
      pontos = 0,
      placares = 0;

  this.nome = function() {
    return nome;
  };
  
  this.pontos = function() {
    return pontos;
  };
  
  this.placares = function() {
    return placares;
  };
  
  this.calcularPontos = function(pts) {
    for(var i in pts) {
      pontos = pontos + parseInt(pts[i]);
    }
  };  
  
  this.calcularPlacares = function(pls) {
    var contador = 0;
    for(var i in pls) {
      if(parseInt(pls[i]) === 3) {
         contador++; 
      } 
    }
    placares = contador;
  };
  
  this.resultado = function() {
    return "" + pontos + "\t - " + placares;
  };
}

////////////////////////  Utils  ////////////////

function utils() {

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }
}
