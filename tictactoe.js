// NB: This doesn't include any AI.

(function (root) {

  var TTT = root.TTT = (root.TTT || {});

  var Game = TTT.Game = function TT() {
    this.player = Game.marks[0];
    this.playerColor = Game.playerColors[0];
    this.board = this.makeBoard();
  }

  Game.marks = ["x", "o"];
  Game.playerColors = ["red", "blue"];

  Game.prototype.diagonalWinner = function () {
    var game = this;

    var diagonalPositions1 = [[0, 0], [1, 1], [2, 2]];
    var diagonalPositions2 = [[2, 0], [1, 1], [0, 2]];

    var winner = null;
    _(Game.marks).each(function (mark) {
      function didWinDiagonal (diagonalPositions) {
        return _.every(diagonalPositions, function (pos) {
          return game.board[pos[0]][pos[1]] === mark;
        });
      }

      var won = _.any(
        [diagonalPositions1, diagonalPositions2],
        didWinDiagonal
      );

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.isEmptyPos = function (pos) {
    return (this.board[pos[0]][pos[1]] === null);
  };

  Game.prototype.horizontalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (i) {
        return _(indices).every(function (j) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.makeBoard = function () {
    return _.times(3, function (i) {
      return _.times(3, function (j) {
        return null;
      });
    });
  };

  Game.prototype.move = function (div, pos) {
    if (!this.isEmptyPos(pos)) {
      return false;
    }

    this.placeMark(div, pos);
    this.switchPlayer();
    return true;
  };

  Game.prototype.placeMark = function (div, pos) {
    this.board[pos[0]][pos[1]] = this.player;
    $(div).html(this.player);
    $(div).css("background-color", this.playerColor);
  };

  Game.prototype.switchPlayer = function () {
    if (this.player === Game.marks[0]) {
      this.player = Game.marks[1];
      this.playerColor = Game.playerColors[1];
    } else {
      this.player = Game.marks[0];
      this.playerColor = Game.playerColors[0];
    }
  };

  Game.prototype.valid = function (pos) {
    // Check to see if the co-ords are on the board and the spot is
    // empty.

    function isInRange (pos) {
      return (0 <= pos) && (pos < 3);
    }

    return _(pos).all(isInRange) && _.isNull(this.board[pos[0]][pos[1]]);
  };

  Game.prototype.verticalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (j) {
        return _(indices).every(function (i) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.winner = function () {
    return (
      this.diagonalWinner() || this.horizontalWinner() || this.verticalWinner()
    );
  };

  Game.prototype.printBoard = function () {
    var game = this;

    game.board.forEach(function(row){
      var first = row[0] == null ? " " : row[0];
      var second = row[1] == null ? " " : row[1];
      var third = row[2] == null ? " " : row[2];

      console.log(first + " | " + second + " | " + third);
    })
  }

  Game.prototype.turn = function (div) {

    var game = this;

    var y = $(div).data('y');
    var x = $(div.parentNode).data('x');
    console.log( "[" + x + "," + y + "]");
    var coords = [x,y];

    if (game.valid(coords)) {
      game.move(div, coords); // insert marks
      if (game.winner()) {
        console.log(game.winner(), "won");
        alert(game.winner().toUpperCase() + " won!");
      }
    } else {
      console.log(game.player, "made an invalid move");
      alert("Invalid move, you are " + game.player + ". Please try again.");
    }


  }

})(this);


// First we instantiate a new object with the this.TTT.Game() constructor function.
var TTT = new this.TTT.Game();

$(function () {
  $('.cell').on('click', function(event){
    TTT.turn(event.currentTarget);
    if (TTT.winner()) { console.log("Someone won!"); }
  });
});



