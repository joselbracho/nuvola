import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hasError, getError } from '../../helpers/error';

const propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    ariaDescribedby: PropTypes.string,
    autoFocus: PropTypes.bool,
    selectClassName: PropTypes.string,
    values: PropTypes.array,
    errors: PropTypes.array
};

const defaultProps = {
    label: '',
    ariaDescribedby: '',
    autoFocus: false,
    selectClassName: '',
    values: [],
    errors: []
};

class Select extends Component {
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
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <div className="select">
                    <select
                    name={this.props.name}
                    value={this.state[this.props.name]}
                    onChange={e => this.handleInputChange(e)}
                    className={'custom-select  select-class' + (this.props.selectClassName ? this.props.selectClassName : '')}
                    autoFocus={this.props.autoFocus ? true : false}
                    aria-describedby={this.props.ariaDescribedby}>
                    <option>Seleccionar...</option>
                    {this.props.values.map((item, i) => (
                        item ? (
                        <option
                            key={`${this.props.name}-${i}`}
                            value={item.id}
                        >
                            {item.name}
                        </option>
                        ) : ''
                    ))}
                    </select>
                    <div className="select__arrow"></div>
                </div>
                {hasError(this.state.errors, this.props.name) &&
                <p className="text-red">{getError(this.state.errors, this.props.name)}</p>
                }
            </div>
        );
    }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

const mapDispatchToProps = {};
export default connect(null, mapDispatchToProps)(Select);
