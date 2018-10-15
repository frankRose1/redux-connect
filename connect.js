/**
 * Redux connect under the hood
 *  for a study reference
 */

const Context = React.createContext();

//Provide the value to the child component as props
class Provider extends React.Component {
  render(){
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

/**
 * Connect - takes in a function and returns a function to be immediately executed
    * take a portion of redux state and make it available to a component as props
    * connected component should also be given access to dispatch
 */
function connect(mapStateToProps){

  return Component => {

    //reciever will subscribe to state changes, apply dispatch and map state to props
    class Receiver extends React.Component {
      componentDidMount() {
        //force an update when state changes
        this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate())
      }

      componentWillUnmount() {
        this.unsubscribe();
      }
      
      render(){
        const {dispatch, getState} = this.props.store;
        const state = getState(); //application wide state
        const stateNeeded = mapStateToProps(state); //state needed for this specific component to be distributed as props
        return <Component dispatch={dispatch} {...stateNeeded}/>;
      }
    }

    class ConnectedComponent extends React.Component {
      render(){
        return (
          <Context.Consumer>
            {store => <Receiver store={store}/>}
          </Context.Consumer>
        )
      }
    }

    return ConnectedComponent;
  }
}

//pretend there is a component inside of <App /> that needs a list of dogs from application state
const ConnectedDogs = connect(state => {
  return {
    dogs: state.dogs
  }
})(Dogs);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
