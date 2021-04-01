import React, { Component } from 'react';
import { connect } from 'react-redux';

class Pagination extends Component {
    constructor(props) {
        super(props);
        
        // options: {
        //     per_page: 0,
        //     current_page: 1,
        //     prev_page: false,
        //     next_page: false,
        //     last_page: 0,
        //     total: 0,
        // }

        // toPage: function(page)
        
        this.pageslen = 3;
    }

    prev(e) {
        var page = this.props.options.current_page = this.props.options.current_page > 1 ? this.props.options.current_page - 1 : 1;
        this.toPage(e, page);
    }

    next(e) {
        var page = this.props.options.current_page = this.props.options.current_page + 1;
        this.toPage(e, page);
    }

    toPage(e, page) {
        e.preventDefault();
        this.props.toPage(page);
    }

    render() {
        const pageNumbers = [];
        let renderPageNumbers;

        if (this.props.options.total > 0) {
            
            for (let i = 1; i <= Math.ceil(this.props.options.total / this.props.options.per_page); i++) {                
                pageNumbers.push(i);
            }

            renderPageNumbers = pageNumbers
                .filter(number => (number == 1 && number >= this.props.options.current_page - this.pageslen) || number == this.props.options.total || (number >= this.props.options.current_page - this.pageslen && number <= this.props.options.current_page + this.pageslen))
                .map(number => {                    
                    let classes = this.props.options.current_page === number ? 'active' : '';
                    return (
                        <li key={number} className={"page-item " + (classes)}>
                            <a className="page-link" href="#" onClick={(e) => this.toPage(e, number)}>{number}</a>
                        </li>
                    );
            });
        }

        return (
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={"page-item " + (this.props.options.current_page == 1 ? 'disabled' : '')}>
                        <a className="page-link" href="#" onClick={(e) => this.toPage(e, 1)}>Primera página</a>
                    </li>
                    <li className={"page-item " + (!this.props.options.prev_page ? 'disabled' : '')}>
                        <a className="page-link" href="#" onClick={(e) => this.prev(e)}>Anterior</a>
                    </li>
                    {renderPageNumbers}
                    <li className={"page-item " + (!this.props.options.next_page ? 'disabled' : '')}>
                        <a className="page-link" href="#" onClick={(e) => this.next(e)}>Siguiente</a>
                    </li>
                    <li className={"page-item " + (!this.props.options.last_page || this.props.options.last_page == this.props.options.current_page ? 'disabled' : '')}>
                        <a className="page-link" href="#" onClick={(e) => this.toPage(e, this.props.options.last_page)}>Última página</a>
                    </li>
                </ul>
            </nav>
        );
    }
}

const mapDispatchToProps = {};
export default connect(null, mapDispatchToProps)(Pagination);
