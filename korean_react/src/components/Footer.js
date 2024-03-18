import React from 'react'
import styled from 'styled-components'

export default function Footer() {
  return (
    <FooterContainer>
        <FooterLinkContent>
            <FooterLink href='/main'>
                <img 
                    src="/images/home_icon.png"
                    style={{ width: '55px', height: '55px' }}
                    alt="home"
                />
            </FooterLink>
            <FooterLink href='/Speaking'>
                <img 
                    src="/images/speaking_icon.png"
                    style={{ width: '55px', height: '55px' }}
                    alt="speaking"
                />
            </FooterLink>
            <FooterLink href='/Writing'>
                <img 
                    src="/images/writing_icon.png"
                    style={{ width: '55px', height: '55px' }}
                    alt="writing"
                />
            </FooterLink>
            <FooterLink href='/Profile'>
                <img 
                    src="/images/profile_icon.png"
                    style={{ width: '55px', height: '55px' }}
                    alt="profile"
                />
            </FooterLink>
        </FooterLinkContent>
    </FooterContainer>
  )
}

const FooterContainer = styled.div`
    border-bottom-left-radius: 40px;    
    border-bottom-right-radius: 40px;   
    z-index: 100;
    opacity: 0.8;
    background-color: #E8E8E8;
`;

const FooterLinkContent = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 5px 0px 15px 0px ;
    border-top: 1px solid #9B9B9B; 
`;

const FooterLink = styled.a`
    color: gray;
    font-size: 14px;
    margin: 10px 20px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        margin-bottom: 6px;
    }
`;

// const FooterDesContainer = styled.div`
//     margin-top: 30px;

//     @media (max-width: 768px) {
//         margin-top: 20px;
//     }
// `;

// const FooterDescRights = styled.h2`
//     color: white;
//     font-size: 14px;
//     text-align: center;
// `