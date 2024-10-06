/*
 *  Copyright 2015-2025 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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


    i18n.eltos.hw.it = {

        "Component":                                "Componente",
        "Element":                                  "Elemento",
        "States (In)":                              "Stati (In)",
        "States (Out)":                             "Stati (Out)",
        "Signals":                                  "Segnali",
        "It has":                                   "Ha",
        "inputs":                                   "ingressi",
        "outputs":                                  "uscite",
        "signals":                                  "segnali",

	"Graph":					"Grafico",
	"Text":						"Testo",
	"Graph: split view":				"Grafico: vista divisa",
	"Graph: interactive mode":			"Grafico: modalità interattiva",
	"name":						"nome",
	"version":					"versione",
	"abilities":					"abilità",
	"value":					"valore",
	"default_value":				"valore di default",
	"nbits":					"nbit",
	"type":						"genere",
	"visible":					"visibile", 

	"EP:CPU_T1:STATES:IN":		"Input è il valore del registro MBR",
	"EP:CPU_T1:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T1:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T2:STATES:IN":		"L'ingresso è il valore del registro PC",
	"EP:CPU_T2:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T2:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T3:STATES:IN":		"L'ingresso è l'uscita del selettore-IR",
	"EP:CPU_T3:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T3:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T4:STATES:IN":		"L'ingresso è il valore del registro RT1",
	"EP:CPU_T4:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T4:SIGNALS:CTL":	"Conferma che il valore di ingresso sia copiato nell'uscita",
	"EP:CPU_T5:STATES:IN":		"L'ingresso è il valore del registro RT2",
	"EP:CPU_T5:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T5:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T6:STATES:IN":		"L'ingresso è l'uscita ALU",
	"EP:CPU_T6:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T6:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T7:STATES:IN":		"L'ingresso è il valore del registro RT3",
	"EP:CPU_T7:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T7:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T8:STATES:IN":		"Input è il valore del registro SR",
	"EP:CPU_T8:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T8:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T9:STATES:IN":		"Input è il valore dell'output della porta A del file di registro",
	"EP:CPU_T9:STATES:OUT":		"L'uscita va al bus interno",
	"EP:CPU_T9:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T10:STATES:IN":		"Input è il valore dell'output della porta B del file di registro",
	"EP:CPU_T10:STATES:OUT":	"L'uscita va al bus interno",
	"EP:CPU_T10:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T11:STATES:IN":		"L'ingresso è la microistruzione/uscita ExCode",
	"EP:CPU_T11:STATES:OUT":	"L'uscita va al bus interno",
	"EP:CPU_T11:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_T12:STATES:IN":		"L'ingresso è l'uscita HPC (contatore delle prestazioni hardware)",
	"EP:CPU_T12:STATES:OUT":	"L'uscita va al bus interno",
	"EP:CPU_T12:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_TA:STATES:IN":		"L'ingresso è l'uscita del registro MAR",
	"EP:CPU_TA:STATES:OUT":		"L'uscita va al bus indirizzi",
	"EP:CPU_TA:SIGNALS:CTL":	"Conferma che il valore di ingresso sia copiato nell'uscita",
	"EP:CPU_TB:STATES:IN":		"L'ingresso è l'uscita del selettore di byte",
	"EP:CPU_TB:STATES:OUT":		"L'uscita va al bus dati",
	"EP:CPU_TB:SIGNALS:CTL":	"Conferma che il valore di ingresso viene copiato nell'uscita",
	"EP:CPU_MUX_A:STATES:MUX_0":	"Ingresso 0 del MUX A, da File Registro (A)",
	"EP:CPU_MUX_A:STATES:MUX_1":	"Ingresso 1 del MUX A, dal registro RT1",
	"EP:CPU_MUX_A:STATES:MUX_O":	"Uscita su ALU, operatore 0",
	"EP:CPU_MUX_A:SIGNALS:MA":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CPU_MUX_B:STATES:MUX_0":	"Ingresso 0 del MUX B, da File Registro (B)",
	"EP:CPU_MUX_B:STATES:MUX_1":	"Ingresso 1 del MUX B, dal registro RT2",
	"EP:CPU_MUX_B:STATES:MUX_2":	"Ingresso 2 del MUX B, valore 4",
	"EP:CPU_MUX_B:STATES:MUX_3":	"Ingresso 3 del MUX B, valore 1",
	"EP:CPU_MUX_B:STATES:MUX_O":	"Uscita su ALU, operatore 1",
	"EP:CPU_MUX_B:SIGNALS:MB":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CPU_MUX_1:STATES:MUX_0":	"Ingresso 0 del MUX 1, da Bus Interno",
	"EP:CPU_MUX_1:STATES:MUX_1":	"Ingresso 1 del MUX 1, da Byte Selector",
	"EP:CPU_MUX_1:STATES:MUX_O":	"Uscita su MBR, da MUX 1",
	"EP:CPU_MUX_1:SIGNALS:M1":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CPU_MUX_2:STATES:MUX_0":	"Ingresso 0 del MUX 2, da Bus Interno",
	"EP:CPU_MUX_2:STATES:MUX_1":	"Ingresso 1 di MUX 2, PC + 4",
	"EP:CPU_MUX_2:STATES:MUX_O":	"Uscita al PC",
	"EP:CPU_MUX_2:SIGNALS:M2":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CPU_MUX_7:STATES:MUX_0":	"Ingresso 0 del MUX 7, da Bus Interno",
	"EP:CPU_MUX_7:STATES:MUX_1":	"Ingresso 1 del MUX 7, da Flag Selector",
	"EP:CPU_MUX_7:STATES:MUX_O":	"Uscita per registrare SR",
	"EP:CPU_MUX_7:SIGNALS:M7":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CU_MUX_A:STATES:MUX_0":	"Ingresso 0 del MUX A, da microADDR + 1",
	"EP:CU_MUX_A:STATES:MUX_1":	"Ingresso 1 del MUX A, da co2maddr",
	"EP:CU_MUX_A:STATES:MUX_2":	"Ingresso 2 del MUX A, da microIR/MADDR",
	"EP:CU_MUX_A:STATES:MUX_3":	"Ingresso 3 del MUX A, da 0",
	"EP:CU_MUX_A:STATES:MUX_O":	"Uscita a microADDR, da MUX A",
	"EP:CU_MUX_A:SIGNALS:A0":	"mIR/A0",
	"EP:CU_MUX_A:SIGNALS:A1":	"Uscita centralina MUX B",
	"EP:CU_MUX_B:STATES:MUX_0":	"Ingresso 0 del MUX B, dal MUX C",
	"EP:CU_MUX_B:STATES:MUX_1":	"Ingresso 1 del MUX B, da NOT (MUX C)",
	"EP:CU_MUX_B:STATES:MUX_O":	"Uscita al MUX A/A1",
	"EP:CU_MUX_B:SIGNALS:MB":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CU_MUX_C:STATES:MUX_0":	"Ingresso 0 del MUX C, da 0",
	"EP:CU_MUX_C:STATES:MUX_1":	"Ingresso 1 del MUX C, da INT",
	"EP:CU_MUX_C:STATES:MUX_2":	"Ingresso 2 del MUX C, da IORdy",
	"EP:CU_MUX_C:STATES:MUX_3":	"Ingresso 3 del MUX C, da MRdy",
	"EP:CU_MUX_C:STATES:MUX_4":	"Ingresso 4 del MUX C, da SR/U",
	"EP:CU_MUX_C:STATES:MUX_5":	"Ingresso 5 del MUX C, da SR/I",
	"EP:CU_MUX_C:STATES:MUX_6":	"Ingresso 6 del MUX C, da SR/Z",
	"EP:CU_MUX_C:STATES:MUX_7":	"Ingresso 7 del MUX C, da SR/N",
	"EP:CU_MUX_C:STATES:MUX_8":	"Ingresso 8 del MUX C, da SR/V",
	"EP:CU_MUX_C:STATES:MUX_9":	"Ingresso 9 del MUX C, da SR/C",
	"EP:CU_MUX_C:STATES:MUX_10":	"Ingresso 10 del MUX C, da InEx",
	"EP:CU_MUX_C:STATES:MUX_O":	"Uscita al MUX B",
	"EP:CU_MUX_C:SIGNALS:CTL":	"Uscita della centralina MUX C",
	"EP:CU_MUX_RA:STATES:MUX_0":	"Ingresso 0 di MUX MR, da IR[SelA+0...SelA+4]",
	"EP:CU_MUX_RA:STATES:MUX_1":	"Ingresso 1 di MUX MR, da SelA",
	"EP:CU_MUX_RA:STATES:MUX_O":	"Uscita su RA",
	"EP:CU_MUX_RA:SIGNALS:CTL":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CU_MUX_RB:STATES:MUX_0":	"Ingresso 0 di MUX MR, da IR[SelB+0...SelB+4]",
	"EP:CU_MUX_RB:STATES:MUX_1":	"Ingresso 1 di MUX MR, da SelB",
	"EP:CU_MUX_RB:STATES:MUX_O":	"Uscita su RB",
	"EP:CU_MUX_RB:SIGNALS:MR":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CU_MUX_RC:STATES:MUX_0":	"Ingresso 0 di MUX MR, da IR[SelC+0...SelC+4]",
	"EP:CU_MUX_RC:STATES:MUX_1":	"Ingresso 1 di MUX MR, da SelC",
	"EP:CU_MUX_RC:STATES:MUX_O":	"Uscita su RC",
	"EP:CU_MUX_RC:SIGNALS:MR":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:CU_MUX_MC:STATES:MUX_0":	"Ingresso 0 del MUX MC, da IR3...IR0",
	"EP:CU_MUX_MC:STATES:MUX_1":	"Ingresso 1 di MUX MC, da SelCop",
	"EP:CU_MUX_MC:STATES:MUX_O":	"Uscita su COP",
	"EP:CU_MUX_MC:SIGNALS:CTL":	"Seleziona il valore di ingresso da inviare all'uscita",
        "EP:CPU_MUX_H:STATES:MUX_0":		"Input 0 di MUX H, dell'Hardware Performance Counter",
        "EP:CPU_MUX_H:STATES:MUX_1":		"Input 1 di MUX H, dell'Hardware Performance Counter",
        "EP:CPU_MUX_H:STATES:MUX_2":		"Input 2 di MUX H, dell'Hardware Performance Counter",
        "EP:CPU_MUX_H:STATES:MUX_3":		"Input 3 di MUX H, dell'Hardware Performance Counter",
        "EP:CPU_MUX_H:STATES:MUX_O":		"Uscita su T12",
	"EP:CPU_MUX_H:SIGNALS:MH":		"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:MAR:STATES:IN":		"L'ingresso è il bus interno",
	"EP:MAR:STATES:OUT":		"L'uscita va al tristato Ta",
	"EP:MAR:SIGNALS:C0":		"Conferma che l'ingresso è memorizzato",
	"EP:MBR:STATES:IN":		"L'ingresso è l'uscita M1",
	"EP:MBR:STATES:OUT":		"L'uscita va al tristato T1",
	"EP:MBR:SIGNALS:C1":		"Conferma che l'ingresso è memorizzato",
	"EP:PC:STATES:IN":		"L'ingresso è l'uscita M2",
	"EP:PC:STATES:OUT":		"L'uscita va al tristato T2",
	"EP:PC:SIGNALS:CTL":		"Conferma che l'ingresso è memorizzato",
	"EP:IR:STATES:IN":		"L'ingresso è il bus interno",
	"EP:IR:STATES:OUT":		"L'uscita va al selettore IR e alla CU",
	"EP:IR:SIGNALS:C3":		"Conferma che l'ingresso è memorizzato",
	"EP:RT1:STATES:IN":		"L'ingresso è il bus interno",
	"EP:RT1:STATES:OUT":		"L'uscita va al tristato T4",
	"EP:RT1:SIGNALS:CTL":		"Conferma che l'ingresso è memorizzato",
	"EP:RT2:STATES:IN":		"L'ingresso è il bus interno",
	"EP:RT2:STATES:OUT":		"L'uscita va al tristato T5",
	"EP:RT2:SIGNALS:CTL":		"Conferma che l'ingresso è memorizzato",
	"EP:RT3:STATES:IN":		"L'ingresso è l'uscita dell'ALU",
	"EP:RT3:STATES:OUT":		"L'uscita va al tristato T7",
	"EP:RT3:SIGNALS:CTL":		"Conferma che l'ingresso è memorizzato",
	"EP:SR:STATES:IN":		"L'ingresso è l'uscita dell'M7",
	"EP:SR:STATES:OUT":		"L'uscita va all'ingresso T8 e alla CU",
	"EP:SR:SIGNALS:CTL":		"Conferma che l'ingresso è memorizzato",
	"EP:REGISTER_FILE:STATES:A":	"Uscita di RF a T9 e MA/0",
	"EP:REGISTER_FILE:STATES:B":	"Uscita di RF a T10 e MB/0",
	"EP:REGISTER_FILE:STATES:C":	"Ingresso a RF dal bus interno",
	"EP:REGISTER_FILE:SIGNALS:RA":	"Seleziona il registro il cui valore viene inviato ad A",
	"EP:REGISTER_FILE:SIGNALS:RB":	"Seleziona il registro il cui valore viene inviato a B",
	"EP:REGISTER_FILE:SIGNALS:RC":	"Seleziona il registro in cui è memorizzato il valore di C",
	"EP:REGISTER_FILE:SIGNALS:LC":	"Conferma che RC sta per essere aggiornato",
	"EP:CPU_ALU:STATES:A":		"Uscita da multiplexor MUX A",
	"EP:CPU_ALU:STATES:B":		"Uscita da multiplexor MUX B",
	"EP:CPU_ALU:STATES:ALU":	"Il risultato va all'ingresso di T6 e RT3",
	"EP:CPU_ALU:STATES:FLAGS":	"Flag C,V,N,Z aggiornate",
	"EP:CPU_ALU:SIGNALS:COP":	"Codice operazione (+, -, *, ...)",
	"EP:SELECT_SR:STATES:MUX_1":	"Ingresso 1 di SELECT-SR, flag U",
	"EP:SELECT_SR:STATES:MUX_2":	"Ingresso 2 di SELECT-SR, flag I",
	"EP:SELECT_SR:STATES:MUX_3":	"Ingresso 3 di SELECT-SR, flag C V N Z",
	"EP:SELECT_SR:STATES:MUX_O":	"Uscita su MUX 7/1",
	"EP:SELECT_SR:SIGNALS:SELP":	"Seleziona il valore di ingresso da inviare all'uscita",
	"EP:SELECT_IR:STATES:MUX_I":	"Ingresso di SELECT-IR da IR",
	"EP:SELECT_IR:STATES:MUX_O":	"Uscita al bus interno tramite T3",
	"EP:SELECT_IR:SIGNALS:SE":	"Estensione firma",
	"EP:SELECT_IR:SIGNALS:SIZE":	"Dimensione",
	"EP:SELECT_IR:SIGNALS:OFFSET":	"Offset",
	"EP:BYTE_SELECTOR:STATES:FROM_MBR":	"Ingresso dal registro MBR",
	"EP:BYTE_SELECTOR:STATES:FROM_DATA":	"Ingresso dal bus dati",
	"EP:BYTE_SELECTOR:STATES:BE":	"Uscita su BE",
	"EP:BYTE_SELECTOR:STATES:TO_MBR":	"Uscita su M1/1",
	"EP:BYTE_SELECTOR:STATES:TO_TD":	"Uscita su Td/ingresso",
	"EP:BYTE_SELECTOR:SIGNALS:W":	"Scrivi nella memoria principale",
	"EP:BYTE_SELECTOR:SIGNALS:SE":	"Estensione firma",
	"EP:BYTE_SELECTOR:SIGNALS:A1A0":	"A1A0",
	"EP:BYTE_SELECTOR:SIGNALS:BW":	"Numero di byte da comprimere",
	"EP:MEMORY:STATES:ADDR":	"Bus indirizzi",
	"EP:MEMORY:STATES:DATA":	"Bus dati",
	"EP:MEMORY:STATES:MRDY":	"Memoria pronta",
	"EP:MEMORY:SIGNALS:BE":		"BW+A1A0",
	"EP:MEMORY:SIGNALS:R":		"Leggi",
	"EP:MEMORY:SIGNALS:W":		"Scrivi",
	"EP:IO:STATES:ADDR":		"Bus indirizzo",
	"EP:IO:STATES:DATA":		"Bus dati",
	"EP:IO:SIGNALS:IOR":		"Leggi dal dispositivo IO",
	"EP:IO:SIGNALS:IOW":		"Scrivi nell'IO Device",
	"EP:KEYBOARD:STATES:ADDR":	"Bus indirizzi",
	"EP:KEYBOARD:STATES:DATA":	"Bus dati",
	"EP:KEYBOARD:SIGNALS:IOR":	"Leggi da tastiera",
	"EP:DISPLAY:STATES:ADDR":	"Bus indirizzi",
	"EP:DISPLAY:STATES:DATA":	"Bus dati",
	"EP:DISPLAY:SIGNALS:IOR":	"Lettura da display (disabilitato)",
	"EP:DISPLAY:SIGNALS:IOW":	"Scrivi sul display",
	"EP:L3D:STATES:ADDR":	"Bus indirizzi",
	"EP:L3D:STATES:DATA":	"Bus dati",
	"EP:L3D:SIGNALS:IOR":	"Leggi da L3D",
	"EP:L3D:SIGNALS:IOW":	"Scrivi nell'L3D",
	"EP:LEDM:STATES:ADDR":	"Bus indirizzi",
	"EP:LEDM:STATES:DATA":	"Bus dati",
	"EP:LEDM:SIGNALS:IOR":	"Leggi da LEDM",
	"EP:LEDM:SIGNALS:IOW":	"Scrivi nell'LEDM",

	"POC:CPU_T1:STATES:IN":	"Input è il valore del registro MBR",
	"POC:CPU_T1:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T1:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_T2:STATES:IN":	"L'ingresso è l'uscita del registro del PC",
	"POC:CPU_T2:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T2:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_T3:STATES:IN":	"L'ingresso è il selettore di uscita del registro IR",
	"POC:CPU_T3:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T3:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_T6:STATES:IN":	"L'ingresso è l'uscita ALU",
	"POC:CPU_T6:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T6:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_T8:STATES:IN":	"L'ingresso è l'uscita del registro SR",
	"POC:CPU_T8:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T8:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_T9:STATES:IN":	"L'input è l'output sulla porta A del file di registro",
	"POC:CPU_T9:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T9:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_T10:STATES:IN":	"L'input è l'output sulla porta B del file di registro",
	"POC:CPU_T10:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T10:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_T11:STATES:IN":	"L'ingresso è l'uscita MIR/ExCode",
	"POC:CPU_T11:STATES:OUT":	"L'uscita va al bus interno",
	"POC:CPU_T11:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_TA:STATES:IN":	"L'ingresso è l'uscita del registro MAR",
	"POC:CPU_TA:STATES:OUT":	"L'uscita va al bus indirizzi",
	"POC:CPU_TA:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_TB:STATES:IN":	"L'ingresso è l'uscita del selettore di byte",
	"POC:CPU_TB:STATES:OUT":	"L'uscita va al bus dati",
	"POC:CPU_TB:SIGNALS:CTL":	"Conferma che l'uscita è collegata all'ingresso",
	"POC:CPU_MUX_A:STATES:MUX_0":	"Ingresso 0 del MUX A, da RF/A",
	"POC:CPU_MUX_A:STATES:MUX_1":	"Ingresso 1 del MUX A, da Bus Interno",
	"POC:CPU_MUX_A:STATES:MUX_O":	"Uscita su ALU/0, da MUX A",
	"POC:CPU_MUX_A:SIGNALS:MA":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CPU_MUX_B:STATES:MUX_0":	"Ingresso 0 del MUX B, da RF/B",
	"POC:CPU_MUX_B:STATES:MUX_1":	"Ingresso 1 del MUX B, da PC",
	"POC:CPU_MUX_B:STATES:MUX_O":	"Uscita su ALU/1, da MUX B",
	"POC:CPU_MUX_B:SIGNALS:MB":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CPU_MUX_1:STATES:MUX_0":	"Ingresso 0 del MUX 1, da Bus Interno",
	"POC:CPU_MUX_1:STATES:MUX_1":	"Ingresso 1 del MUX 1, da bus dati",
	"POC:CPU_MUX_1:STATES:MUX_O":	"Uscita su MBR, da MUX 1",
	"POC:CPU_MUX_1:SIGNALS:M1":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CPU_MUX_7:STATES:MUX_0":	"Ingresso 0 del MUX 7, da Bus Interno",
	"POC:CPU_MUX_7:STATES:MUX_1":	"Ingresso 1 di MUX 7, da Flag Selector",
	"POC:CPU_MUX_7:STATES:MUX_O":	"Uscita su SR, da MUX 7",
	"POC:CPU_MUX_7:SIGNALS:M7":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CU_MUX_A:STATES:MUX_0":	"Ingresso 0 del MUX A, da mADDR + 1",
	"POC:CU_MUX_A:STATES:MUX_1":	"Ingresso 1 del MUX A, da co2maddr",
	"POC:CU_MUX_A:STATES:MUX_2":	"Ingresso 2 del MUX A, da mIR/MADDR",
	"POC:CU_MUX_A:STATES:MUX_3":	"Ingresso 3 del MUX A, da 0",
	"POC:CU_MUX_A:STATES:MUX_O":	"Uscita a mADDR, da MUX A",
	"POC:CU_MUX_A:SIGNALS:A0":	"mIR/A0",
	"POC:CU_MUX_A:SIGNALS:A1":	"Uscita della centralina MUX B",
	"POC:CU_MUX_B:STATES:MUX_0":	"Ingresso 0 del MUX B, dal MUX C",
	"POC:CU_MUX_B:STATES:MUX_1":	"Ingresso 1 del MUX B, da NOT (MUX C)",
	"POC:CU_MUX_B:STATES:MUX_O":	"Uscita al MUX A/A1, dal MUX B",
	"POC:CU_MUX_B:SIGNALS:MB":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CU_MUX_C:STATES:MUX_0":	"Ingresso 0 del MUX C, da 0",
	"POC:CU_MUX_C:STATES:MUX_1":	"Ingresso 1 del MUX C, da INT",
	"POC:CU_MUX_C:STATES:MUX_2":	"Ingresso 2 del MUX C, da IORdy",
	"POC:CU_MUX_C:STATES:MUX_3":	"Ingresso 3 del MUX C, da MRdy",
	"POC:CU_MUX_C:STATES:MUX_4":	"Ingresso 4 del MUX C, da SR/U",
	"POC:CU_MUX_C:STATES:MUX_5":	"Ingresso 5 del MUX C, da SR/I",
	"POC:CU_MUX_C:STATES:MUX_6":	"Ingresso 6 del MUX C, da SR/Z",
	"POC:CU_MUX_C:STATES:MUX_7":	"Ingresso 7 del MUX C, da SR/N",
	"POC:CU_MUX_C:STATES:MUX_8":	"Ingresso 8 del MUX C, da SR/V",
	"POC:CU_MUX_C:STATES:MUX_9":	"Ingresso 9 del MUX C, da SR/C",
	"POC:CU_MUX_C:STATES:MUX_10":	"Ingresso 10 del MUX C, da InEx",
	"POC:CU_MUX_C:STATES:MUX_O":	"Uscita al MUX B",
	"POC:CU_MUX_C:SIGNALS:CTL":	"Uscita della centralina MUX C",
	"POC:CU_MUX_RA:STATES:MUX_0":	"Ingresso 0 di MUX MR, da IR[SelA+0...SelA+4]",
	"POC:CU_MUX_RA:STATES:MUX_1":	"Ingresso 1 di MUX MR, da SelA",
	"POC:CU_MUX_RA:STATES:MUX_O":	"Uscita su RA",
	"POC:CU_MUX_RA:SIGNALS:CTL":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CU_MUX_RB:STATES:MUX_0":	"Ingresso 0 di MUX MR, da IR[SelB+0...SelB+4]",
	"POC:CU_MUX_RB:STATES:MUX_1":	"Inserimento t 1 di MUX MR, da SelB",
	"POC:CU_MUX_RB:STATES:MUX_O":	"Uscita su RB",
	"POC:CU_MUX_RB:SIGNALS:MR":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CU_MUX_RC:STATES:MUX_0":	"Ingresso 0 di MUX MR, da IR[SelC+0...SelC+4]",
	"POC:CU_MUX_RC:STATES:MUX_1":	"Ingresso 1 di MUX MR, da SelC",
	"POC:CU_MUX_RC:STATES:MUX_O":	"Uscita su RC",
	"POC:CU_MUX_RC:SIGNALS:MR":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:CU_MUX_MC:STATES:MUX_0":	"Ingresso 0 di MUX MC, da IR3...IR0",
	"POC:CU_MUX_MC:STATES:MUX_1":	"Ingresso 1 di MUX MC, da SelCop",
	"POC:CU_MUX_MC:STATES:MUX_O":	"Uscita su COP",
	"POC:CU_MUX_MC:SIGNALS:CTL":	"Seleziona il valore di ingresso da inviare all'uscita",
	"POC:MAR:STATES:IN":	"L'ingresso è il bus interno",
	"POC:MAR:STATES:OUT":	"L'uscita va al tristato Ta",
	"POC:MAR:SIGNALS:C0":	"Conferma che l'ingresso è memorizzato",
	"POC:MBR:STATES:IN":	"L'ingresso è l'uscita M1",
	"POC:MBR:STATES:OUT":	"L'uscita va al tristato T1",
	"POC:MBR:SIGNALS:C1":	"Conferma che l'ingresso è memorizzato",
	"POC:PC:STATES:IN":	"L'ingresso è il bus interno",
	"POC:PC:STATES:OUT":	"L'uscita va al tristato T2",
	"POC:PC:SIGNALS:CTL":	"Conferma che l'ingresso è memorizzato",
	"POC:IR:STATES:IN":	"L'ingresso è il bus interno",
	"POC:IR:STATES:OUT":	"L'uscita va al selettore IR e alla CU",
	"POC:IR:SIGNALS:C3":	"Conferma che l'ingresso è memorizzato",
	"POC:RT1:STATES:IN":	"L'ingresso è il bus interno",
	"POC:RT1:STATES:OUT":	"L'uscita va a select-rt1",
	"POC:RT1:SIGNALS:CTL":	"Conferma che l'ingresso è memorizzato",
	"POC:SR:STATES:IN":	"L'ingresso è l'uscita di M7",
	"POC:SR:STATES:OUT":	"L'uscita va all'ingresso T8 e alla CU",
	"POC:SR:SIGNALS:CTL":	"Conferma che l'ingresso è memorizzato",
	"POC:REGISTER_FILE:STATES:A":	"Uscita di RF a T9 e MA/0",
	"POC:REGISTER_FILE:STATES:B":	"Uscita di RF a T10 e MB/0",
	"POC:REGISTER_FILE:STATES:C":	"Ingresso a RF dal bus interno",
	"POC:REGISTER_FILE:SIGNALS:RA":	"Seleziona il registro il cui valore viene inviato ad A",
	"POC:REGISTER_FILE:SIGNALS:RB":	"Seleziona il registro il cui valore viene inviato a B",
	"POC:REGISTER_FILE:SIGNALS:RC":	"Seleziona il registro in cui è memorizzato il valore di C",
	"POC:REGISTER_FILE:SIGNALS:LC":	"Conferma che RC sta per essere aggiornato",
	"POC:CPU_ALU:STATES:A":	"Uscita da multiplexor MUX A",
	"POC:CPU_ALU:STATES:B":	"Uscita da multiplexor MUX B",
	"POC:CPU_ALU:STATES:ALU":	"Il risultato va all'ingresso di T6 e RT3",
	"POC:CPU_ALU:STATES:FLAGS":	"Flag C,V,N,Z aggiornati",
	"POC:CPU_ALU:SIGNALS:COP":	"Codice operazione (+, -, *, ...)",
	"POC:SELECT_RT1:STATES:MUX_I":	"Ingresso di SELECT-RT1 da RT1",
	"POC:SELECT_RT1:STATES:MUX_O":	"Uscita al bus interno tramite T3",
	"POC:SELECT_RT1:SIGNALS:SE":	"Estensione firma",
	"POC:SELECT_RT1:SIGNALS:SIZE":	"Dimensione",
	"POC:SELECT_RT1:SIGNALS:OFFSET":	"Offset",
	"POC:MEMORY:STATES:ADDR":	"Bus indirizzi",
	"POC:MEMORY:STATES:DATA":	"Bus dati",
	"POC:MEMORY:STATES:MRDY":	"Memoria pronta",
	"POC:MEMORY:SIGNALS:BW":	"Larghezza byte",
	"POC:MEMORY:SIGNALS:R":	"Leggi",
	"POC:MEMORY:SIGNALS:W":	"Scrivi",
	"POC:IO:STATES:ADDR":	"Bus indirizzo",
	"POC:IO:STATES:DATA":	"Bus dati",
	"POC:IO:SIGNALS:IOR":	"Leggi dal dispositivo IO",
	"POC:IO:SIGNALS:IOW":	"Scrivi nell'IO Device",
	"POC:KEYBOARD:STATES:ADDR":	"Bus indirizzi",
	"POC:KEYBOARD:STATES:DATA":	"Bus dati",
	"POC:KEYBOARD:SIGNALS:IOR":	"Leggi da tastiera",
	"POC:DISPLAY:STATES:ADDR":	"Bus indirizzi",
	"POC:DISPLAY:STATES:DATA":	"Bus dati",
	"POC:DISPLAY:SIGNALS:IOR":	"Lettura dal display (disabilitato)",
	"POC:DISPLAY:SIGNALS:IOW":	"Scrivi sul display",
	"POC:L3D:STATES:ADDR":	"Bus indirizzi",
	"POC:L3D:STATES:DATA":	"Bus dati",
	"POC:L3D:SIGNALS:IOR":	"Leggi da L3D",
	"POC:L3D:SIGNALS:IOW":	"Scrivi nell'L3D", 

	"_last_":				    "_last_"

    } ;

