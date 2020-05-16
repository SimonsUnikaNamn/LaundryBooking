import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from './loading.gif';

const Background = styled.div`
	opacity: 0.3;
	background-color: white;
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 5;
`

const Wrapper = styled.div`
	width: 66px;
    height: 66px;

    position:absolute; /*it can be fixed too*/
    left:0; right:0;
    top:0; bottom:0;
    margin:auto;
	z-index: 10;
	background-color: transparent;
`

const LoadingModal = ({ loading }) => {
	if(!loading) {
		return null
	}

	return (
		<>
			<Background>
			</Background>
			<Wrapper>
				<img src={LoadingSpinner} alt="Loading" />
			</Wrapper>
		</>
	)
}


export default LoadingModal