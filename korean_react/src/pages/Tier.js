import React from 'react'
import "./Tier.css"

export default function Tier() {

    const tiers = [
        {id:1, rating:"평민", description:"한글을 제대로 못 배움"},
        {id:2, rating:"상인", description:"어느 정도 의사소통 가능"},
        {id:3, rating:"양반", description:"한국어 실력 중"},
        {id:4, rating:"무관", description:"한국어 실력 중상"},
        {id:5, rating:"문관", description:"한국어 실력 상"},
        {id:6, rating:"세자", description:"한글 창시자의 아들"},
        {id:7, rating:"왕", description:"한글의 창시자, 세 종 대 왕"},
    ]

    const reversedTiers = [...tiers].reverse()

    return (
        <div className='tier__container'>
            {reversedTiers.map(tier => (
                <div className="tier__box" key={tier.id}>
                    <img src={`images/tier/tier_${tier.id}.jpg`} alt={`Tier ${tier.id}`} className='tier__image'/>
                    <p className='tier__box__tiername'>{tier.rating}</p>
                    <p className='tier__box__tiername2'>{tier.description}</p>
                </div>
            ))}
        </div>
    )
}