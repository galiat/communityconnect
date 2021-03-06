import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';



class Header extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      activeItem: []
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleClick(cat, index) {
    this.props.handleEvent(cat);
    if(index === -1) this.setState({activeItem:[]});
    this.state.activeItem.includes(index) ?  this.setState({
      activeItem : this.state.activeItem.filter( selected => selected !== index)
    })
    : this.state.activeItem.push(index);
  }

  categoryMenuItems() {
    return this.props.categories.map((cat, index) =><DropdownItem onClick = {() => this.handleClick(cat, index)} key={cat}>
    {this.state.activeItem.includes(index) ? <span>&#10004; {cat}</span>: cat}</DropdownItem>);
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Community Connect - Revere</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>Category</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick = {() => this.handleClick("Clear", -1)} key={"Clear"}>Clear</DropdownItem>
                  <DropdownItem divider/>
                  { this.categoryMenuItems() }
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
