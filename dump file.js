







Game.prototype.copy = function() {
	/*copies Game into a new game object and returns that object*/
	var g = new Game(this.p1,this.p2,this.gametype,this.fen,this.pgn);
	// console.log("game.copy() :: successful");
	return g;
};
Game.prototype.change_turn = function() {
	/*changes the turn of Game*/
	this.turn = this.get_opp_color(this.get_turn());
};

Game.prototype.is_checkmate = function() {
	/*returns whether or not the position in game is currently checkmate*/
	if (this.get_legal_moves().length == 0 && this.is_check()) {
		console.log("CHECKMATE");
		return true;
	}
	return false;
};
Game.prototype.is_stalemate = function() {
	/*returns whether or not the position in game is currently stalemate*/
	if (this.get_legal_moves().length == 0 && !this.is_check()) {
		console.log("STALEMATE");
		return true;
	}
	return false;
};
Game.prototype.get_players = function() {
	/*returns an object {p1,p2} which returns the respective players in Game*/
	return {p1:this.p1,p2:this.p2};
};




Game.prototype.is_legal_move = function(move) {
	console.log("lel");
	/*returns whether or not the move from src -> dest is a legal move*/
	var moves = this.get_legal_moves();
	for (var i = 0; i < moves.length; i++) {
		if (moves[i].src.x == move.src.x && moves[i].src.y == move.src.y &&
			moves[i].dest.x == move.dest.x && moves[i].dest.y == move.dest.y) {
			console.log("is_legal_move() true");
			return true;
		}
	}
	return false;
}
Game.prototype.make_move = function(move,force_move) {
	/*attempts to make move of piece but checks move legality first if force_move != true*/
	// move.print();
	if (force_move || this.is_legal_move(move)) {
		// console.log("moving piece "+move.piece.color+" "+move.piece.type);
		// move.print();
		// this.add_move_to_PGN(move);
		this.move_piece(move);
		this.change_turn();
	} else {
		console.log(".make_move :: move is not valid");
		console.log(move);
	}
	this.set_FEN();
	// this.print();
};
Game.prototype.move_piece = function(move) {
	/*places piece on dest and sets the src to null*/
	this.set_piece(move.dest,move.piece);
	this.set_piece(move.src,null);
};
Game.prototype.game_after_move = function(move) {
	/*returns Game object after move has been made*/
	var g = this.copy();
	g.make_move(move,true);
	return g;
};







Game.prototype.set_piece = function(sq,piece) {
	/*sets the sq on board equal to piece*/
	this.board[sq.x][sq.y] = piece;
};
Game.prototype.set_FEN = function() {
	/*sets the fen property of Game to refect the current state of Game*/
	var newFEN = "";
	var inc = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (this.board[7-i][j] == null) {
				inc++;
			} else {
				if (inc > 0) {
					newFEN += inc;
					inc = 0;
				}
				if (this.board[7-i][j].color == "WHITE") {
					if (this.board[7-i][j].type == "KING") {
						newFEN += "K";
					} else if (this.board[7-i][j].type == "QUEEN") {
						newFEN += "Q";
					} else if (this.board[7-i][j].type == "BISHOP") {
						newFEN += "B";
					} else if (this.board[7-i][j].type == "KNIGHT") {
						newFEN += "N";
					} else if (this.board[7-i][j].type == "ROOK") {
						newFEN += "R";
					} else if (this.board[7-i][j].type == "PAWN") {
						newFEN += "P";
					}
				} else {
					if (this.board[7-i][j].type == "KING") {
						newFEN += "k";
					} else if (this.board[7-i][j].type == "QUEEN") {
						newFEN += "q";
					} else if (this.board[7-i][j].type == "BISHOP") {
						newFEN += "b";
					} else if (this.board[7-i][j].type == "KNIGHT") {
						newFEN += "n";
					} else if (this.board[7-i][j].type == "ROOK") {
						newFEN += "r";
					} else if (this.board[7-i][j].type == "PAWN") {
						newFEN += "p";
					}
				}
			}
		}
		if (inc > 0) {
			newFEN += inc;
			inc = 0;
		}
		if (i != 7) {
			newFEN += "/";
		}
	}
	newFEN += " ";
	if (this.turn == "WHITE") {
		newFEN += "w";
	} else {
		newFEN += "b";
	}
	newFEN += " ";
	if (this.castling[0]) {
		newFEN += "K";
	}
	if (this.castling[1]) {
		newFEN += "Q";
	}
	if (this.castling[2]) {
		newFEN += "k";
	}
	if (this.castling[3]) {
		newFEN += "q";
	} else {
		if (!this.castling[0] && !this.castling[1] && !this.castling[2] && !this.castling[3]) {
			newFEN += "-";
		}
	}
	newFEN += " ";
	if (this.enPassant_allowedAt != null) {
		newFEN += pairToSq(this.enPassant_allowedAt);
	} else {
		newFEN += "-";
	}
	newFEN += " ";
	newFEN += this.halfmove;
	newFEN += " ";
	newFEN += this.move_count;

	this.fen = newFEN;
};
Game.prototype.pair_to_sq = function(sq) {
	/*converts the square in the array to the square on the chessboard
		ex: e4 */
	var square = "";
	switch (sq.y) {
		case 0: square += "a"; break;
		case 1: square += "b"; break;
		case 2: square += "c"; break;
		case 3: square += "d"; break;
		case 4: square += "e"; break;
		case 5: square += "f"; break;
		case 6: square += "g"; break;
		case 7: square += "h"; break;
		default: console.log("ERR :: sq out of range");
	}
	square += sq.x+1;
	return square;
};




Move.prototype.print = function() {
	console.log(this.piece.color+" "+this.piece.type+"   "+this.src.x+","+this.src.y+" --> "+this.dest.x+","+this.dest.y);
};
Move.prototype.get_notation = function() {
	/*returns a string containing the notation of the move in game*/
	// var notation = "";
	// if (piece == null) {
	// 	return null;
	// }
	// if (piece.type == "KING") {
	// 	notation += "K";
	// } else if (piece.type == "QUEEN") {
	// 	notation += "Q";
	// } else if (piece.type == "BISHOP") {
	// 	notation += "B";
	// } else if (piece.type == "KNIGHT") {
	// 	notation += "N";
	// } else if (piece.type == "ROOK") {
	// 	notation += "R";
	// } else {
	// 	//add nothing
	// }
	// if (game.get_piece(move.dest) != null) {
	// 	notation += "x";
	// }
	// notation += pairToSq(move.dest);
	// if (game.game_after_move(move).is_checkmate()) {
	// 	notation += "#";
	// } else if (game.game_after_move(move).is_check()) {
	// 	notation += "+";
	// }
	// return notation;
};