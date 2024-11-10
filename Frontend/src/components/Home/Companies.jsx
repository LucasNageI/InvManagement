import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/component_styles/Home/Companies.css'
const Company = ({ companies }) => {
    const companies_array = companies.map((company) => {
        return (
            <div className='company' key={company.id}>
                <div className='info-container'>
                        <span className='company-title'>{company.business_name}</span>
                        <span>Creation date: {company.creation_date}</span>
                </div>
                <div className='launch-slack-container'>
                    <Link to={`/Company/${company.id}/inventory`} className='launch-company'><button className='launch-btn'>Launch</button></Link>
                </div>
            </div>
        )
    })
    return (companies_array)
}

export default Company