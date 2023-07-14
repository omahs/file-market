import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { OptionSwitch, SwitchButton } from '../../components/Switch/Switch'
import { cutNumber } from '../../utils/number'
import { StyledAmount, SwitchWrapperTabs } from './Tabs.styles'

export interface TabItem extends OptionSwitch {
  url: string
  amount?: number
}

export interface TabsProps {
  tabs: TabItem[]
}

export const Tabs: React.FC<TabsProps> = observer(({ tabs }) => {
  const [tab, setTab] = useState<TabItem | undefined>()
  const location = useLocation()
  const navigate = useNavigate()

  const onChange = (newValue: TabItem) => {
    setTab(newValue)
    navigate(newValue.url)
  }

  useEffect(() => {
    const currentTabUrl = location?.pathname?.split('/')?.at(-1) ?? ''
    let tabIndex = tabs.find((t) =>
      t.value === currentTabUrl,
    )
    if (!tabIndex) {
      tabIndex = tabs[0]
    }
    setTab(tabIndex)
  }, [location, tabs])

  useEffect(() => {
    console.log(tab)
  }, [tab?.value])

  return (
    <>
      <SwitchWrapperTabs>
        {tabs.map((tabItem) => (
          <SwitchButton
            key={tabItem.value}
            onClick={() => {
              onChange(tabItem)
              navigate(tabItem.url)
            }}
            activate={tab?.value === tabItem.value}
          >
            {tabItem.label}
          </SwitchButton>
        ))}
      </SwitchWrapperTabs>
      <StyledAmount>{`Total ${cutNumber(tab?.amount)}`}</StyledAmount>
    </>
  )
})
