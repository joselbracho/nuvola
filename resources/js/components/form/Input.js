import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hasError, getError } from '../../helpers/error';

const propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    ariaDescribedby: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    inputClassName: PropTypes.string,
    errors: PropTypes.array
};

const defaultProps = {
    label: '',
    type: 'text',
    vale: '',
    ariaDescribedby: '',
    placeholder: '',
    required: false,
    readOnly: false,
    autoFocus: false,
    inputClassName: '',
    errors: []
};

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            [this.props.name]: this.props.value,
            errors: this.props.errors
        }
    }

    handleInputChange (e) {
        const event = e;
        this.setState({
          [e.target.name]: e.target.value,
          errors: {
            ...this.state.errors,
            ...{ [e.target.name]: '' }
    
          }
        });

        this.props.onChange(event);
    }

    render() {
        return (
            <div className="form-group">
                { this.props.label &&
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                }
                <input 
                    value={this.state[this.props.name]} 
                    onChange={e => this.handleInputChange(e)}
                    name={this.props.name}
                    type={this.props.type} 
                    className={'form-control ' + (this.props.inputClassName ? this.props.inputClassName : '')} 
                    aria-describedby={this.props.ariaDescribedby} 
                    placeholder={this.props.placeholder}
                    required={this.props.required ? true : false}
                    readOnly={this.props.readOnly ? true : false}
                    autoFocus={this.props.autoFocus ? true : false}
                />
                {hasError(this.state.errors, this.props.name) &&
                    <p className="text-red">{getError(this.state.errors, this.props.name)}</p>
                }
            </div>
        );
    }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

const mapDispatchToProps = {};
export default connect(null, mapDispatchToProps)(Input);
