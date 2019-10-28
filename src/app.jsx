import React from 'react'
import ReactDOM from 'react-dom'
import Table, { Headers, Tbody, Tds, Ths, Th, Td } from './index'
import One from './examples/One'
import Two from './examples/Two'
import Three from './examples/Three'
import Four from './examples/Four'
import Five from './examples/Five'
import Six from './examples/Six'
import Seven from './examples/Seven'
import Eight from './examples/Eight'
import Nine from './examples/Nine'
import Ten from './examples/Ten'
import Eleven from './examples/Eleven'
import Twelve from './examples/Twelve'
import Prototype from './examples/Prototype'
import Thirteen from './examples/Thirteen'
import Fourteen from './examples/Fourteen'
import Tree from './examples/Tree'
import EditCell from './examples/EditCell'
import EditRow from './examples/EditRow'
import EditRowWithValidation from './examples/EditRowWithValidation'
import Loading from './examples/Loading'
import Pagination from './examples/Pagination'
import PaginationServerSide from './examples/PaginationServerSide'
import './app.less'


class App extends React.Component {
    render() {
        return (
            <div>
                <div>
                    {/* <One /> */}
                </div>
                <div>
                    {/* <Two /> */}
                </div>
                <div>
                    {/* <Three /> */}
                </div>
                <div>
                    {/* <Four/> */}
                </div>
                <div>
                    {/* <Five /> */}
                </div>
                <div>
                    {/* <Six sorter/>  */}
                </div>
                <div>
                    {/* <Seven sorter by/> */}
                </div>
                <div>
                    {/* <Eight filter control/> */}
                </div>
                <div>
                    {/* <Nine defaulFilter/> */}
                </div>
                <div>
                    {/* <Ten header footer/> */}
                </div>
                <div>
                    {/* <Eleven expandrow/> */}
                </div>
                <div>
                    {/* <Twelve leftOver/> */}
                </div>
                <div>
                    {/* <Prototype/> */}
                </div>
                <div>
                    {/* <Thirteen/> */}
                </div>
                <div>
                    {/* <Tree/> */}
                </div>
                <div>
                    {/* <EditCell /> */}
                </div>
                <div>
                    {/* <EditRow /> */}
                </div>
                <div>
                    <EditRowWithValidation />
                </div>
                <div>
                    {/* <Loading /> */}
                </div>
                <div>
                    {/* <Pagination /> */}
                </div>
                <div>
                    {/* <PaginationServerSide /> */}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))