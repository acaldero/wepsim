// Simulator types (for sim_p parameter in register functions)

interface SimState {
    name: string;
    verbal: string;
    visible: boolean;
    nbits: string;
    value: any;
    default_value: any;
    draw_data: any[];
}

interface SimSignalBehavior {
    nparameters: number;
    types?: string[];
    operation: (s_expr: string[]) => void;
    verbal: (s_expr: string[]) => string;
}

interface SimSignal {
    name: string;
    verbal?: string | string[];
    visible: boolean;
    type: string;
    value: number;
    default_value: number;
    nbits: string;
    behavior: string[];
    depends_on?: string[];
    fire_name: string[];
    draw_data: string[][];
    draw_name: string[][];
    forbidden?: boolean;
}

interface SimCtrlState {
    name: string;
    state: string;
    is_pointer: boolean;
    default_eltos?: any;
}

interface SimElement {
    name: string;
    description: string;
    type: string;
    belongs: string;
    states: Record<string, { ref: string | number }>;
    signals: Record<string, { ref: string }>;
    states_inputs: string[];
    states_outputs: string[];
    signals_inputs: string[];
    signals_output: string[];
    states_mapping: any[];
}

interface SimComponent {
    name: string;
    version: string;
    abilities: string[];
    details_name?: string[];
    details_fire?: string[][];
    write_state?: (vec: any) => any;
    read_state?: (vec: any, check: any) => boolean;
    get_state?: (reg: string) => string | null;
    get_value?: (elto: any) => any;
    set_value?: (elto: any, value: any) => void;
}

interface Simulator {
    sim_name?: string;
    sim_short_name?: string;
    sim_img_processor?: string;
    sim_img_controlunit?: string;
    sim_img_cpu?: string;

    components: Record<string, SimComponent>;
    states: { BR: Record<number, SimState> & { length?: number }; [key: string]: SimState | Record<number, SimState> };
    signals: Record<string, SimSignal>;
    behaviors: Record<string, SimSignalBehavior>;
    elements: Record<string, SimElement>;
    ctrl_states: Record<string, SimCtrlState>;
    internal_states: Record<string, any>;
    events: Record<string, any>;
}

// Firmware / instruction decode types

interface FirmwareInstructionField {
    name: string;
    type: string;
    startbit: number | string;
    stopbit: number | string;
    bits_start?: (number | string)[];
    bits_stop?: (number | string)[];
    bits?: (number | string)[][];
    value?: string;
    address_type?: string;
    context?: Record<string, any>;
}

interface FirmwareInstruction {
    name: string;
    oc: string;
    eoc?: string;
    fields: FirmwareInstructionField[];
    fields_all?: FirmwareInstructionField[];
    microcode?: Record<string, any>[];
    opcode_mask_eocbin?: number;
    opcode_mask_valbin?: number;
    'mc-start'?: number;
    [key: string]: any;
}

interface DecodeInstructionResult {
    oinstruction: FirmwareInstruction | null;
    oc_code: number;
    eoc_code: number;
}
