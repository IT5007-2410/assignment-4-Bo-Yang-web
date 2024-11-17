import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <View>
          <Text>Issue Filter Component</Text>
        </View>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
//   header: { height: 50, backgroundColor: '#537791' },
//   text: { textAlign: 'center' },
//   dataWrapper: { marginTop: -1 },
//   row: { height: 100, backgroundColor: '#E7E6E1' }
//   });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#537791',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 5,
  },
  leftAlignText: {
    textAlign: 'left',
    fontSize: 14,
    paddingHorizontal: 5,
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    minHeight: 60,
    backgroundColor: '#E7E6E1',
    flexWrap: 'wrap',
  },
});

const width = [20, 110, 50, 40, 60, 20, 60];

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    // const rowData = [issue.id, issue.title, issue.owner, issue.status, issue.created?.toString(), issue.effort, issue.due?.toString()];
    const rowData = [
      <Text>{issue.id || "N/A"}</Text>,
      <Text>{issue.title || "N/A"}</Text>,
      <Text>{issue.owner || "N/A"}</Text>,
      <Text>{issue.status || "N/A"}</Text>,
      <Text>{formatDate(issue.created) || "N/A"}</Text>,
      <Text>{issue.effort || "N/A"}</Text>,
      <Text>{formatDate(issue.due) || "N/A"}</Text>
    ];
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row data={rowData} widthArr={width} style={styles.row} textStyle={styles.text} />
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    // const tableHeaders = ['ID', 'Title', 'Owner', 'Status', 'Created', 'Effort', 'Due'];
    const tableHeaders = [
      <Text>ID</Text>,
      <Text>Title</Text>,
      <Text>Owner</Text>,
      <Text>Status</Text>,
      <Text>Created</Text>,
      <Text>Effort</Text>,
      <Text>Due</Text>
    ];
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <View style={styles.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        <Row data={tableHeaders} widthArr={width} style={styles.header} textStyle={styles.text} />
        <ScrollView style={styles.dataWrapper}>
          {issueRows}
        </ScrollView>
      </Table>
    {/****** Q2: Coding Ends here. ******/}
    </View>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = { title: '', owner: '', effort: '', due: '' };
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setTitle = (text) => {
      this.setState({ title: text });
    };
  
    setOwner = (text) => {
      this.setState({ owner: text });
    };
  
    setEffort = (text) => {
      this.setState({ effort: text });
    };
  
    setDueDate = (text) => {
      this.setState({ due: text });
    };
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const newIssue = {
        title: this.state.title,
        owner: this.state.owner,
        effort: parseInt(this.state.effort, 10) || 0, // 默认 effort 为 0
        due: this.state.due,
      };
      this.props.createIssue(newIssue);
      this.setState({
        title: '',
        owner: '',
        effort: '',
        due: '',
      });
    }
      /****** Q3: Code Ends here. ******/
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <TextInput
            placeholder="Title"
            value={this.state.title}
            onChangeText={this.setTitle}
            style={{ borderWidth: 1, marginBottom: 8, padding: 5 }}
            />
            <TextInput
              placeholder="Owner"
              value={this.state.owner}
              onChangeText={this.setOwner}
              style={{ borderWidth: 1, marginBottom: 8, padding: 5 }}
            />
            <TextInput
              placeholder="Effort"
              value={this.state.effort}
              onChangeText={this.setEffort}
              keyboardType="numeric"
              style={{ borderWidth: 1, marginBottom: 8, padding: 5 }}
            />
            <TextInput
              placeholder="Due Date (YYYY-MM-DD)"
              value={this.state.due}
              onChangeText={this.setDueDate}
              style={{ borderWidth: 1, marginBottom: 8, padding: 5 }}
            />

            <Button title="Add Issue" onPress={this.handleSubmit} />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = { nameInput: '' };
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setOwner = (text) => {
    this.setState({ nameInput: text });
    };
    /****** Q4: Code Ends here. ******/
    
    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
      const {nameInput} = this.state;
      // console.log('GraphQL result:', result);

      if (!nameInput.trim()) {
        alert('Owner name cannot be empty.');
        return;
      }
      const query = `mutation addToBlacklist($nameInput: String!) {
        addToBlacklist(nameInput: $nameInput)
      }`;
    
      try {
        const result = await graphQLFetch(query, { nameInput });
        // console.log('GraphQL result:', result);
        alert('successfully added to blacklist'); 
        this.setState({ nameInput: '' }); 
        
      } catch (error) {
        alert(`Error adding owner to blacklist: ${error.message}`);
      }
      // this.setState({ nameInput: '' }); 
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput
            placeholder="Enter Owner Name"
            value={this.state.nameInput}
            onChangeText={this.setOwner}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              marginBottom: 10,
              padding: 10,
            }}
          />
          <Button title="Add to Blacklist" onPress={this.handleSubmit} />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [], currentView: 'Q1', };
        this.createIssue = this.createIssue.bind(this);
        this.setView = this.setView.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    setView(view) {
      this.setState({ currentView: view });
    }
    
    render() {
    return (
      // <div>
      //   <nav style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
      //     <button style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => this.setView('Q1')}>
      //       Issue Filter
      //     </button>
      //     <button style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => this.setView('Q2')}>
      //       Issue Table
      //     </button>
      //     <button style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => this.setView('Q3')}>
      //       Issue Add
      //     </button>
      //     <button style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => this.setView('Q4')}>
      //       Blacklist
      //     </button>
      //   </nav>

      //   <>
      //   {currentView === 'Q1' && (
      //       {/****** Q1: Start Coding here. *******/}
      //       <IssueFilter />
      //       {/****** Q1: Code ends here *******/}
      //   )}

      //   {currentView === 'Q2' && (
      //     <>
      //       {/****** Q2: Start Coding here. *******/}
      //       <IssueTable issues={issues} />
      //       {/****** Q2: Code ends here *******/}
      //     </>
      //   )}

      //   {currentView === 'Q3' && (
      //       {/****** Q3: Start Coding here. *******/}
      //       <IssueAdd createIssue={this.createIssue} />
      //       {/****** Q3: Code Ends here. *******/}
      //   )}

      //   {currentView === 'Q4' && (
      //       {/****** Q4: Start Coding here. *******/}
      //       <BlackList />
      //       {/****** Q4: Code Ends here *******/}
      //   )}
      //   </>
      // </div>

    //后版本
    <>
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter />
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues} />
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue} />
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList />
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
