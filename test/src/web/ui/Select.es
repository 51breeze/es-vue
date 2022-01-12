package web.ui;

import web.ui.ElSelect;

class Select extends ElSelect{


    @override
    focus(){

        super.focus();

    }

    @override
    onMounted(){

        this.focus();

        this.watch('value', (newValue,oldValue)=>{

            console.log('-------', newValue,oldValue)

        })

       
        
    }

}
