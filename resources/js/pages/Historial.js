import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { destructServerErrors, hasError, getError } from '../helpers/error';
import { getHistorial} from '../actions/historial';
import Pagination from '../components/Pagination';
import { resolve } from 'path';
import { Link } from 'react-router-dom';
import GuestNav from '../components/GuestNav';
import Footer from '../components/Footer';

const propTypes = {
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  getHistorial: PropTypes.func.isRequired
};

class Historial extends Component {
  constructor (props) {
    super(props);
    this.state = { 
      historial: [],
      search: '',
      pagination: {
        current_page: 1,
        prev_page: false,
        next_page: false,
        last_page: 0,
        total: 0,
        per_page: 0
      },
      errors: null      
    };
    this.timeout =  0;
    this.order_by = 'id',
    this.order_type = 'desc'
    this.sort_direction =  'down';
  }
  
  componentDidMount() {
    this.loadHistorial();
  }
  
  loadHistorial(page = 1) {
    this.setState({item_selected: ''});
    this.props.getHistorial(page, {
      search: this.state.search,
      order_by: this.order_by,
      order_type: this.order_type,
    })
    .then(response => this.loadSuccess(response))
    .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  loadSuccess (response) {
    const prev = !!response.links.prev;
    const next = !!response.links.next;

    this.setState({
      historial: response.data,
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
        this.loadHistorial(1);
      }, 300);
    }
  }

  sortBy(field) {
    this.order_by = field,
    this.order_type = (this.order_type === 'asc') ? 'desc' : 'asc',

    this.sort_direction = (this.order_type === 'asc') ? 'up' : 'down'

    this.loadHistorial(1);
  }

  renderSortDirection(field) {
    return  this.order_by === field ? (<i className={"align-middle fas fa-sort-" + this.sort_direction}></i>) : '';
  }

  render () {

    let renderSortDirection;

    return (
  
      <DocumentTitle title={`Historial de consultas - ${window.App.name}`}>
       <React.Fragment>
        <GuestNav />
        
        <div className="container-fluid content-page">
        <Link
          className="button-1"
          to="/"
          >
          VOLVER AL INICIO
        </Link>
          <h1>Historial de consultas</h1>

          <div className="table-responsive table-container">

            {/* Search */}
            <div className="px-3">
              <form className="form-group" onSubmit={e => {
                e.preventDefault();
                this.loadHistorial(1);
              }} method="POST">

                <div className="form-group">
                  <h3 htmlFor="search">Buscar</h3>
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
                    placeholder="Escribe una IP"
                  />
                </div>

                <div>
                  <button className="btn btn-primary">Buscar</button>
                </div>

              </form>
            </div>

            {/* List */}
            <table className="table">
              <thead>
                  <tr>
                    <th className="text-center pointer" onClick={() => this.sortBy('id')}># {this.renderSortDirection('id')}</th>
                    <th className="pointer" onClick={() => this.sortBy('ip')}>ip {this.renderSortDirection('ip')}</th>
                    <th className="pointer" onClick={() => this.sortBy('miami_humidity')}>Miami{this.renderSortDirection('miami_humidity')}</th>
                    <th className="pointer" onClick={() => this.sortBy('orlando_humidity')}>Orlando{this.renderSortDirection('orlando_humidity')}</th>
                    <th className="pointer" onClick={() => this.sortBy('newyork_humidity')}>New York{this.renderSortDirection('newyork_humidity')}</th>
                    <th className="pointer" onClick={() => this.sortBy('created_at')}>Fecha de consulta{this.renderSortDirection('created_at')}</th>
                  </tr>
              </thead>
              <tbody>
                {this.state.historial.map((item, i) => (
                  item ? (
                    <tr key={i}>
                      <td className="text-center">{item.id}</td>
                      <td>{item.ip}</td>
                      <td>{item.miami_humidity}</td>
                      <td>{item.orlando_humidity}</td>
                      <td>{item.newyork_humidity}</td>
                      <td>{item.created_at}</td>
                    </tr>
                  ) : ''
                ))}
              </tbody>
            </table>
            {this.state.historial.length > 0 ? <Pagination options={this.state.pagination} toPage={this.loadHistorial.bind(this)} /> : ''}
          </div>
        </div>
        <Footer />
      </React.Fragment>
    </DocumentTitle>
   
    );
  }
}

Historial.propTypes = propTypes;
const mapStateToProps = ({ auth, loading }) => ({ auth, loading });
const mapDispatchToProps = { getHistorial };
export default connect(mapStateToProps, mapDispatchToProps)(Historial);
