import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { destructServerErrors, hasError, getError } from '../helpers/error';
import { getClients, deleteClient} from '../actions/clients';
import Pagination from '../components/Pagination';
import GuestNav from '../components/GuestNav';
import { resolve } from 'path';
import { Link } from 'react-router-dom';
import $ from "jquery";

const propTypes = {
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  getClients: PropTypes.func.isRequired,
  deleteClient: PropTypes.func.isRequired,
};

class Clients extends Component {
  constructor (props) {
    super(props);
    this.state = { 
      user: this.props.auth.user,
      clients: [],
      search: '',
      pagination: {
        current_page: 1,
        prev_page: false,
        next_page: false,
        last_page: 0,
        total: 0,
        per_page: 0
      },
      item_selected: '',
      create_success: false,
      update_success: false,
      delete_success: false,
      errors: null      
    };
    this.timeout =  0;
    this.order_by = 'id',
    this.order_type = 'desc'
    this.sort_direction =  'down';
  }
  
  componentDidMount() {
    this.loadClients();
  }

  closeMessages(){
    this.setState({
      create_success: false,
      delete_success: false,
      update_success: false
    });
  }
  
  loadClients(page = 1) {
    this.setState({item_selected: ''});
    this.props.getClients(page, {
      search: this.state.search,
      order_by: this.order_by,
      order_type: this.order_type,
    })
    .then(response => this.loadSuccess(response))
    .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }
  
  itemSelected(e, item_selected) {
    this.setState({item_selected: item_selected});
  }

  confirmDelete(){
    this.props.deleteClient(this.state.item_selected)
    .then(response => this.deleteSuccess(response))
    .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  deleteSuccess(response){
    this.closeMessages();
    this.loadClients();
    this.setState({delete_success: true});
  }

  loadSuccess (response) {
    const prev = !!response.links.prev;
    const next = !!response.links.next;

    this.setState({
      clients: response.data,
      pagination: {
        current_page: response.meta.current_page,
        prev_page: prev,
        next_page: next,
        last_page: response.meta.last_page,
        total: response.meta.total,
        per_page: response.meta.per_page
      }
    });
  }
  

  handleInputChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        ...{ [e.target.name]: '' }

      },
      success: ''
    });

    if (e.target.name === 'search') {
      this.timeout = setTimeout(() => {
        this.loadClients(1);
      }, 300);
    }
  }

  sortBy(field) {
    this.order_by = field,
    this.order_type = (this.order_type === 'asc') ? 'desc' : 'asc',

    this.sort_direction = (this.order_type === 'asc') ? 'up' : 'down'

    this.loadClients(1);
  }

  renderSortDirection(field) {
    return  this.order_by === field ? (<i className={"align-middle fas fa-sort-" + this.sort_direction}></i>) : '';
  }

  render () {
    const delete_message = (
      <div className="alert alert-success fade-in" role="alert">
        Client deletd.
        <button type="button" className="close" aria-label="Close" onClick={(e) => {this.closeMessages()}}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );

    let renderSortDirection;

    return (
      <DocumentTitle title={`Clients - ${window.App.name}`}>
      <React.Fragment >
        <GuestNav />
        <div className="container-fluid content-page">
          <h1>Clients</h1>
          <hr/>

          {/* Messages */}
          {this.state.delete_success === true ? delete_message : ''}

          <div className="table-responsive table-container">

            {/* Search */}
            <div className="px-3">
              <form className="form-group" onSubmit={e => {
                e.preventDefault();
                this.loadClients(1);
              }} method="POST">

                <div className="form-group">
                  <h3 htmlFor="search">Search</h3>
                  <input 
                    id="search"
                    name="search" 
                    value={this.state.search} 
                    onChange={e => {
                      this.handleInputChange(e)
                    }}
                    type="text" 
                    className="form-control" 
                    aria-describedby="nombre" 
                    placeholder="find clients by name, last name, email, phone or address"
                  />
                </div>

                <div>
                  <button className="btn btn-primary">Search</button>
                </div>

              </form>
            </div>

            {/* List */}
            <table className="table">
              <thead>
                  <tr>
                    <th className="text-center pointer" onClick={() => this.sortBy('id')}># {this.renderSortDirection('id')}</th>
                    <th className="text-center">Image</th>
                    <th className="pointer" onClick={() => this.sortBy('name')}>Name {this.renderSortDirection('name')}</th>
                    <th className="pointer" onClick={() => this.sortBy('last_name')}>Last Name {this.renderSortDirection('name')}</th>
                    <th className="pointer" onClick={() => this.sortBy('phone')}>Phone {this.renderSortDirection('name')}</th>
                    <th className="pointer" onClick={() => this.sortBy('address')}>Adrress {this.renderSortDirection('name')}</th>
                    <th></th>
                  </tr>
              </thead>
              <tbody>
                {this.state.clients.map((item, i) => (
                  item ? (
                    <tr key={i}>
                      <td className="text-center">{item.id}</td>
                      <td className="text-center"><img className="logo-nav" src={item.image}/></td>

                      <td>{item.name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>

                      <td>
                        <button 
                          type="button"
                          onClick={(e) => {this.itemSelected(e, item.id)}}
                          className="btn btn-danger btn-sm" 
                          data-toggle="modal" 
                          data-target="#deleteModal">
                            Delete
                        </button>
                        <button 
                          type="button"
                          className="btn btn-info btn-sm"
                          onClick={(e) => {this.itemSelected(e, item.id)}}
                          data-toggle="modal" 
                          data-target="#editClientModal">
                            View Details / Travels
                        </button>
                      </td>
                    </tr>
                  ) : ''
                ))}
              </tbody>
            </table>
            {this.state.clients.length > 0 ? <Pagination options={this.state.pagination} toPage={this.loadClients.bind(this)} /> : ''}
          </div>

          {/* Delete */}
          <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">Are you sure you want to proceed this action?</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Client <b>{this.state.item_selected}</b> will be deleted, this cannot be undone are you sure to proceed?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                  <button
                    data-dismiss="modal"
                    type="button" 
                    className="btn btn-primary btn-danger"
                    onClick={(e) => {this.confirmDelete()}}
                    >
                    Delete
                    </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </React.Fragment >
      </DocumentTitle>
    );
  }
}

Clients.propTypes = propTypes;
const mapStateToProps = ({ auth, loading }) => ({ auth, loading });
const mapDispatchToProps = { getClients, deleteClient };
export default connect(mapStateToProps, mapDispatchToProps)(Clients);
