package pages;

import web.components.Page;

import logo from '../assets/logo.png'

import pages.Manager;

@Metadata('address', logo, name=Manager.name, name2=Address.name2 , lang=Manager.lang('sssss'))
@Redirect(pages.home.Index)
class Address extends Page{

    static get name2(){
        return 'address is true';
    }

    @Override
    render(){
        return <div />
    }

}