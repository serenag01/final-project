class Inputs {
    wPressed : boolean;
    aPressed : boolean;
    sPressed : boolean;
    dPressed : boolean;

    constructor() {
        this.wPressed = false;
        this.aPressed = false;
        this.sPressed = false;
        this.dPressed = false;
    }

    toggleW() {
        this.wPressed = !this.wPressed;
    }

    toggleA() {
        this.aPressed = !this.aPressed;
    }

    toggleS() {
        this.sPressed = !this.sPressed;
    }

    toggleD() {
        this.dPressed = !this.dPressed;
    }

    trueW() {
        this.wPressed = true;
    }

    trueA() {
        this.aPressed = true;
    }
    
    trueS() {
        this.sPressed = true;
    }

    trueD() {
        this.dPressed = true;
    }

}
export default Inputs;