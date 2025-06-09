(define (problem scene1)
  (:domain manip)
  (:objects
    tool_01 - item
    tool_02 - item
    tool_03 - item
    tool_04 - item
    tool_05 - item
  )
  (:init
    (ontable tool_01)
    (ontable tool_02)
    (ontable tool_03)
    (ontable tool_04)
    (ontable tool_05)
    (clear tool_01)
    (clear tool_02)
    (clear tool_03)
    (clear tool_04)
    (clear tool_05)
    (handempty)
  )
  (:goal (and ))
)