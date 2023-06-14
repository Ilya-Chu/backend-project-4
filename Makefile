name: 'project test'

on:
  - push
  - pull_request
  
env:
  CI: true

jobs:
  build:

    runs-on:  ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node ${{ matrix.node }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node }}
        cache: 'npm'
    - name: npm install
      run: |
        make install
      env:
        CI: true
    - name: Test & publish code coverage
        # Publish code coverage on Code Climate
        # https://github.com/paambaati/codeclimate-action
      uses: paambaati/codeclimate-action@v3.2.0
        # Add Code Climate secret key
      env:
          CC_TEST_REPORTER_ID: b21d766c81e8582b7b6ab49acec55d92b32265ab6a0d6b39eebdeb3d80ef2346
      with:
          coverageCommand: make test-coverage
          debug: true