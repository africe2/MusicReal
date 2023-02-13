import requests

def makeGetRequest(token, url, params={}):
	headers = {"Authorization": "Bearer {}".format(token)}
	response = requests.get(url, headers=headers, params=params)

	# 200 code indicates request was successful
 
	print(url)
	print('response here!')
	print(response.text)

	return response.json()