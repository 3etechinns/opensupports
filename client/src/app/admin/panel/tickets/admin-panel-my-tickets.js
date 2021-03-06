import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';
import ModalContainer from 'app-components/modal-container';
import CreateTicketForm from 'app/main/dashboard/dashboard-create-ticket/create-ticket-form';

import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Header from 'core-components/header';
import Message from 'core-components/message';

class AdminPanelMyTickets extends React.Component {

    static defaultProps = {
        userId: 0,
        departments: [],
        tickets: []
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveMyTickets());
    }

    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('MY_TICKETS')} description={i18n('MY_TICKETS_DESCRIPTION')} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getProps()}/>}
                <div style={{textAlign: 'right', marginTop: 10}}>
                    <Button onClick={this.onCreateTicket.bind(this)} type="secondary" size="medium">
                        <Icon size="sm" name="plus"/> Create ticket
                    </Button>
                </div>
            </div>
        );
    }

    getProps() {
        return {
            userId: this.props.userId,
            departments: this.props.departments,
            tickets: this.props.tickets,
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }

    onCreateTicket() {
        ModalContainer.openModal(
            <div>
                <CreateTicketForm onSuccess={this.onCreateTicketSuccess.bind(this)} />
                <div style={{textAlign: 'center'}}>
                    <Button onClick={ModalContainer.closeModal} type="link">Close</Button>
                </div>
            </div>
        );
    }

    onCreateTicketSuccess() {
        ModalContainer.closeModal();
        this.props.dispatch(AdminDataAction.retrieveMyTickets());
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId,
        departments: store.session.userDepartments,
        tickets: store.adminData.myTickets,
        loading: !store.adminData.myTicketsLoaded,
        error: store.adminData.myTicketsError
    };
})(AdminPanelMyTickets);
