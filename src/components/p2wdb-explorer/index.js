/*
  Component for looking up the balance of a BCH address.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Table, Card } from 'react-bootstrap'
import axios from 'axios'
import { DatatableWrapper, TableBody, TableHeader } from 'react-bs-datatable'

const SERVER = 'https://xec-p2wdb.fullstack.cash/'

const TABLE_HEADERS = [
  {
    prop: 'createdAt',
    title: 'Created At',
    isFilterable: true
  },
  {
    prop: 'txid',
    title: 'Transaction'
  },
  {
    prop: 'hash',
    title: 'Hash'
  },
  {
    prop: 'appId',
    title: 'App ID'
  }
]

class P2WDBExplorer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      balance: '',
      textInput: '',
      wallet: props.wallet,
      endpoint: `${SERVER}entry/all/${0}`,
      data: []
    }

    // Encapsulate dependencies
    this.axios = axios

    // Bind 'this' to event handlers
    this.handleEntries = this.handleEntries.bind(this)
    this.getEntries = this.getEntries.bind(this)

    // _this = this
  }

  render () {
    return (

      <>
        <Container>
          <Row>
            <Col className='text-break' style={{ textAlign: 'center' }}>
              <Card>
                <Card.Title>Lastest P2WDB Entries</Card.Title>

                <DatatableWrapper body={this.state.data} headers={TABLE_HEADERS}>
                  <Table>
                    <TableHeader />
                    <TableBody />
                  </Table>
                </DatatableWrapper>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }

  async componentDidMount () {
    this.handleEntries()

    // Get data and update table
    // every 20 seconds
    setInterval(this.handleEntries, 20000)
  }

  // Top-level orchestration function.
  async handleEntries () {
    const entries = await this.getEntries()
    this.generateDataTable(entries)
  }

  // REST petition to Get data fron the pw2db
  async getEntries (endpoint) {
    try {
      const url = endpoint || this.state.endpoint

      // console.log(`url : ${url}`)
      const options = {
        method: 'GET',
        url,
        data: {}
      }
      const result = await this.axios.request(options)

      this.setState({
        entries: result.data.data,
        inFetch: false
      })

      return result.data.data
    } catch (err) {
      console.warn('Error in getEntries() ', err)
    }
  }

  // Generate table content
  generateDataTable (dataArr) {
    try {
      const data = []

      for (let i = 0; i < dataArr.length; i++) {
        const entry = dataArr[i]
        const row = {
          // createdAt row data
          createdAt: new Date(entry.createdAt).toLocaleString(),
          txid: (<a href={`https://explorer.be.cash/tx/${entry.key}`} target='_blank' rel='noreferrer'>{this.cutString(entry.key)}</a>),
          hash: (<a href={`${SERVER}entry/hash/${entry.hash}`} target='_blank' rel='noreferrer'>{this.cutString(entry.hash)}</a>),
          appId: entry.appId || 'none'
        }
        data.push(row)
      }
      console.log('data: ', data)

      this.setState({
        data
      })
    } catch (err) {
      console.warn('Error in generateDataTable() ', err)
    }
  }

  cutString (txid) {
    try {
      const subTxid = txid.slice(0, 4)
      const subTxid2 = txid.slice(-4)
      return `${subTxid}...${subTxid2}`
    } catch (err) {
      console.warn('Error in cutString() ', err)
    }
  }
}

export default P2WDBExplorer
