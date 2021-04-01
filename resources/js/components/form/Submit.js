import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const propTypes = {
    color: PropTypes.string,
    text: PropTypes.string
};

const defaultProps = {
    color: 'primary',
    text: 'Enviar'
};

class Submit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button type="submit" className={`btn btn-${this.props.color}`}>{this.props.text}</button>
        );
    }
}

Submit.propTypes = propTypes;
Submit.defaultProps = defaultProps;

const mapDispatchToProps = {};
export default connect(null, mapDispatchToProps)(Submit);
