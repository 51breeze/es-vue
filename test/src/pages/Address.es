package pages;

import web.components.Component;

import logo from '../assets/logo.png'

import pages.Manager;

@Metadata('address', logo, name=Manager.name, name2=Address.name2 , lang=Manager.lang('sssss'))
@Redirect(pages.home.Index)
class Address extends Component{

    static get name2(){
        return 'address is true';
    }

    @Override
    render(){
        return <div />
    }

}