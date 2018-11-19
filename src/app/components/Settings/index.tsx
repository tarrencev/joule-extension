import React from 'react';
import { connect } from 'react-redux';
import { Form, Select, Checkbox, Button, Icon, Modal } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Link } from 'react-router-dom';
import { changeSettings } from 'modules/settings/actions';
import {
  Denomination,
  Fiat,
  denominationNames,
  denominationSymbols,
  fiatSymbols,
} from 'utils/constants';
import { typedKeys } from 'utils/ts';
import { AppState } from 'store/reducers';
import './style.less';

type SettingsKey = keyof AppState['settings'];

interface StateProps {
  settings: AppState['settings'];
}

interface DispatchProps {
  changeSettings: typeof changeSettings;
}

type Props = StateProps & DispatchProps;

class Settings extends React.Component<Props> {
  render() {
    const { settings } = this.props;

    return (
      <Form className="Settings" layout="vertical">
        <div className="Settings-section">
          <h3 className="Settings-section-title">
            Units & Currencies
          </h3>
          <Form.Item label="Bitcoin unit">
            <Select
              size="large"
              value={settings.denomination}
              disabled={settings.isNoFiat && settings.isFiatPrimary}
              onChange={v => this.handleChangeSelect('denomination', v)}
            >
              {typedKeys(Denomination).map(d => (
                <Select.Option key={d} value={d}>
                  {denominationNames[d]} ({denominationSymbols[d]})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Currency">
            <Select
              size="large"
              disabled={settings.isNoFiat && !settings.isFiatPrimary}
              value={settings.fiat}
              onChange={v => this.handleChangeSelect('fiat', v)}
            >
              {typedKeys(Fiat).map(f => (
                <Select.Option key={f} value={f}>
                  {f} ({fiatSymbols[f]})
                </Select.Option>
              ))}
            </Select>

            <Checkbox
              name="isFiatPrimary"
              checked={settings.isFiatPrimary}
              onChange={this.handleChangeCheckbox}
            >
              Show fiat as primary currency
            </Checkbox>
            <Checkbox
              name="isNoFiat"
              checked={settings.isNoFiat}
              onChange={this.handleChangeCheckbox}
            >
              Disable {settings.isFiatPrimary ? 'bitcoin' : 'fiat'} equivalents
            </Checkbox>
          </Form.Item>
        </div>

        <div className="Settings-section">
          <h3 className="Settings-section-title">
            Node
          </h3>
          <Button
            type="danger"
            size="large"
            block
            ghost
            onClick={this.clearNode}
          >
            Clear node connection settings
          </Button>
        </div>
      </Form>
    );
  }

  private handleChangeSelect = (key: SettingsKey, value: SelectValue) => {
    this.props.changeSettings({ [key]: value });
  };

  private handleChangeCheckbox = (ev: CheckboxChangeEvent) => {
    this.props.changeSettings({
      [ev.target.name as SettingsKey]: ev.target.checked
    })
  };

  private clearNode = () => {
    Modal.confirm({
      title: 'Are you sure?',
      content: `
        You will be returned to the starting screen and be required to
        re-enter your node connection settings to return. All other settings
        will remain unchanged.
      `,
      onOk() {
        console.log('Cleared');
      },
    });
  };
}

const ConnectedSettings = connect<StateProps, DispatchProps, {}, AppState>(
  state => ({
    settings: state.settings,
  }),
  { changeSettings },
)(Settings);

export default ConnectedSettings;
