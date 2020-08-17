/*
 *  Copyright 2015-2020 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
 *
 *  This file is part of WepSIM.
 *
 *  WepSIM is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WepSIM is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with WepSIM.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


    i18n.eltos.compiler.ja = {

		'NO TAG OR DIRECTIVE':		'予想されるタグ（X :)またはディレクティブ（.X）が、代わりに、このトークンが見つかりました：',
		'INVALID TAG FORMAT':		'タグは、（文字または下線で始まる）英数字フォーマットに従わなければなりません。',
		'TAG OR INSTRUCTION':		'タグは、命令と同じ名前を持つことはできません。',
		'REPEATED TAG':		'繰り返さタグ：',
		'NO NUMERIC DATATYPE':		'数値データ型の値が期待されたが見つから：',
		'NO POSITIVE NUMBER':		'正の数を期待されたが見つから：',
		'NO NUMBER OF BYTES':		'.SPACEで予備バイトの予測数（自然数）が、見つかりました：',
		'INVALID ALIGN VALUE':		'正の数として整列パラメータを期待されたが見つから：',
		'REMEMBER ALIGN VAL':		'数は、アライメント用の2つの電源であることを忘れないでください、MIPSのマニュアルを参照してください。',
		'NOT CLOSED STRING':		'文字列が閉じていない（引用符でそれを終了するのを忘れました）',
		'NO QUOTATION MARKS':		'予想引用符の間の文字列ではなくが見つかりました：',
		'UNEXPECTED DATATYPE':		'予期しないデータ型名：',
		'INVALID SEGMENT NAME':		'.dataの/の.text / ...セグメント期待されたが見つから：',
		'NO MAIN OR KMAIN':		'タグ「主」または「kmain」はテキスト・セグメント（単数または複数）で定義されていません。プログラムを実行するために、これらのタグのうちの少なくとも一つを定義することが義務付けられています',
		'UNKNOWN 1':		'不明なエラーが発生した（1）',
		'UNKNOWN 2':		'予期しないエラー（2）',
		'REMEMBER I. FORMAT':		'命令フォーマットは次のように定義されていることに注意してください：',
		'SEVERAL CANDIDATES':		'命令とフィールドは、複数の可能な命令で一致します。マイクロコードを確認してください。現在、命令フォーマットを指定できます。',
		'NOT MATCH MICRO':		'命令とフィールドが定義された命令フォーマットと一致していません',
		'CHECK MICROCODE':		'マイクロコードを確認してください。おそらく、あなたはフィールドを追加するのを忘れて、数がそのスペースに収まらない、またはあなただけの間違った命令を使用します',
                "LABEL NOT DEFINED":    "Label used but not defined in the assembly code: ",

           // microcode
           "LABEL NOT FOUND":        "Expected '<label>:' not found, found token: ",
           "REPEATED LABEL":         "Label is repeated: ",
           "INVALID LABEL FORMAT":   "Label format is not valid for: ",
           "OPEN BRACE NOT FOUND":   "Expected '{' not found",
           "CLOSE BRACE NOT FOUND":  "Expected '}' not found",
           "OPEN PAREN. NOT FOUND":  "Expected '(' not found",
           "CLOSE PAREN. NOT FOUND": "Expected ')' not found",
           "COMMA NOT FOUND":        "Expected ',' not found",
           "EQUAL NOT FOUND":        "Expected '=' not found",
           "SIGNAL NOT EXISTS":      "Signal does not exists: ",
           "SIGNAL NO DIRECTLY":     "signal cannot be used directly, please use the Control Unit signals instead.",
           "INCORRECT BIN. FORMAT":  "Incorrect binary format: ",
           "OUT OF RANGE":           "Value out of range: ",
	   "EMPTY MICROCODE":        "Empty microcode",
           "EMPTY NAME LIST":        "Empty name list for register: x=[]",
	   "DUPLICATE SP":           "Duplicate definition of stack pointer",
	   "NO SP":                  "Expected stack_pointer token not found",
	   "UNDEF. INSTR.":          "Undefined instruction: ",
           "MORE 100 FIELDS":        "More than 100 fields in a single instruction.",
	   "CO AS FIELD NAME":       "Instruction field has 'co' as name.",
	   "NW AS FIELD NAME":       "Instruction field has 'nwords' as name.",
	   "NO CO FIELD":            "Expected keyword 'co' not found",
           "INCORRECT CO BIN.":      "Incorrect binary format on 'co': ",
           "INCORRECT COP BIN.":     "Incorrect binary format on 'cop': ",
           "INVALID PARAMETER":      "Invalid parameter: ",
           "ALLOWED PARAMETER":      "It only allows the following fields: reg, num, inm, addr, address",
           "MISSING TOKEN ON":       "'token' is missing after '(' on: ",
           "MISSING ) ON":           "')' is missing on: ",
           "CO ALREADY USED":        "'co' is already been used by: ",
           "CO+COP ALREADY USED":    "'co+cop' is already been used by: ",
           "NO NWORDS":              "Expected keyword 'nwords' not found",
           "INCORRECT ADDRESSING":   "Type of addressing incorrect (abs or rel)",
           "UNEXPECTED FIELD":       "Unexpected field found: ",
           "STARTBIT OoR":           "startbit out of range: ",
           "STOPBIT OoR":            "stopbit out of range: ",
           "OVERLAPPING FIELD":      "Overlapping field: ",
           "BAD COP BIN. LEN.":      "Incorrect binary length for 'cop': ",
           "SP NOT DEFINED":         "Stack pointer register was not defined",
           "NO LABEL FETCH":         "Label 'fetch' not defined",
           "NO LABEL BEGIN":         "'begin' not found",
           "NO CO CODES":            "There is not enough 'co' codes available for instructions",
           "NO LABEL MADDR":         "MADDR label not found: ",
           "INS. NAME":              "Instruction name: '",
           "NOT VALID FOR":          "' is not valid for: ",
           "BIGGER THAN":            "is bigger than ",
           "BITS":                   " bits",
           "EXPECTED VALUE":         "Expected value that fits in a '",
           "BUT INSERTED":           "but inserted ",
           "INSTEAD":                "instead",

		'_last_':		'_last_'

    };
