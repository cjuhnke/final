import React from 'react';
import { ListView, StyleSheet, Image, View} from 'react-native';
import { Body, Title, Right, Container, Header, Content, Icon, List, ListItem, Text, Card, CardItem, Left, Button} from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      content: [],
      players: [],
      time: [0],
    }
  }

  getContent() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appuHktN2ZLgfKPwG/players?maxRecords=500&view=Grid%20view";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keykybUZUy6yWeJHv'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        content: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getContent(); // refresh the list when we're done
  }

  getPlayers() {
    let player1 = Math.floor(Math.random()*100)
    this.setState({
      players: [this.state.content[player1].fields.last,
                this.state.content[player1].fields.first,
                this.state.content[player1].fields.pts,
                this.state.content[player1].fields.reb,
                this.state.content[player1].fields.ast,
                this.state.content[player1].id,
                this.state.content[player1].fields.votes]
    })
    this.setState({
      time: [1]
    })
  }

  upvote(data) {
    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appuHktN2ZLgfKPwG/players/" + this.state.players[5];

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keykybUZUy6yWeJHv', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: this.state.players[6] + 1
        }
      })
    };
    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getContent(); // refresh the list when we're done
      this.getPlayers();
    });
  }

  downvote(data) {
    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appuHktN2ZLgfKPwG/players/" + this.state.players[5];

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keykybUZUy6yWeJHv', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: this.state.players[6] - 1
        }
      })
    };
    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getContent(); // refresh the list when we're done
      this.getPlayers();
    });
  }

  render() {
    let image = 'https://nba-players.herokuapp.com/players/'+this.state.players[0]+'/'+this.state.players[1]
    return (
      <Container>
      <View style={styles.container}>
        <Title style={styles.title}>NBA Player Rank</Title>
        <Card>
          <CardItem>
            <Left>
              <Body>
                <Text>{this.state.players[0] && this.state.players[1]+" "+this.state.players[0]}</Text>
                <Text note>{this.state.players[0] && "Points: " + this.state.players[2]} </Text>
                <Text note>{this.state.players[0] && "Rebounds: " + this.state.players[3] + " Assists: " + this.state.players[4]}</Text>
                <Text>{this.state.players[0] && "Current Vote Total: " + this.state.players[6]}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image source={{uri: image}} style={{height: 350, width: 350}}/>
          </CardItem>
        </Card>
      </View>
      <View style={styles.start}>
          {this.state.time[0] < 1 &&
            <Button iconLeft onPress={() => this.getPlayers()}>
              <Text>Start!</Text>
            </Button>}
      </View>
      <View style={styles.button}>
          {this.state.players[0] &&
            <Button iconLeft onPress={() => this.downvote()}>
              <Icon name="arrow-back" />
              <Text>Downvote</Text>
            </Button>}
          {this.state.players[0] &&
            <Button iconRight onPress={() => this.upvote()}>
                <Text>Upvote</Text>
                <Icon name="arrow-forward" />
            </Button>}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 36
  },
  button: {
    flexDirection: "row",
    flex: 1,
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    padding: 15,
  },
  start: {
    flexDirection: "row",
    flex: 1,
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    justifyContent: 'center',
    padding: 15,
  }
});
