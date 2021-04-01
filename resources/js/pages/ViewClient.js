import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getClient } from '../actions/clients';
import { destructServerErrors, hasError, getError } from '../helpers/error';
import Input from '../components/form/Input';
import ProgressBarDownload from '../components/ProgressBarDownload';
import DocumentTitle from 'react-document-title';
import GuestNav from '../components/GuestNav';
const propTypes = {
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  getClient: PropTypes.func.isRequired
};
  
class ViewClient extends Component {
  constructor (props) {
    super(props);
    this.state = {
        name: '',
        last_name: '',
        email: '',
        address: '',
        phone: '',
        travels: [],
        image: '',
        errors: '',
        success: null,
        loading: true,
      };
  }

  componentDidMount() {
    this.props.getClient(this.props.match.params.id)
        .then(response => this.getSuccess(response))
        .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  getSuccess (e) {
    console.log(e.data);
    this.setState({
      name: e.data.name,
      last_name: e.data.last_name,
      email: e.data.email,
      address: new Date(e.data.birthdate),
      phone: e.data.username,
      travels: e.data.travels,
      image: e.data.image,
      loading: false
    });
  }

  render () {
  


    return (
    <DocumentTitle title={`Clients - ${window.App.name}`}>
    <React.Fragment >
        <GuestNav />
       <div className="container-fluid content-page">
            <h1>View Client</h1>
            <hr/>
       	{this.state.success === false ? error : ''}	
        {this.state.loading && <ProgressBarDownload percentage={100} text={this.state.loadingText} />}
        {!this.state.loading &&
            <Input
            label="Name"
            value={this.state.name}
            name="document_number"
            type="text"
            inputClassName=""
            ariaDescribedby="Name"
            />
           
        }

      </div>
      </React.Fragment >
      </DocumentTitle>
    );
  }
}

ViewClient.propTypes = propTypes;

const mapDispatchToProps = { 
    getClient, 
};

const mapStateToProps = ({ auth, loading }) => ({ auth, loading });

export default connect(mapStateToProps,mapDispatchToProps)(ViewClient);

